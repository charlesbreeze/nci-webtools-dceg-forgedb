import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "path";
import { createReadStream, mkdirSync, writeFileSync } from "fs";
import { createInterface } from "readline/promises";
import Database from "better-sqlite3";
import minimist from "minimist";
import camelCase from "lodash/camelCase.js";
import groupBy from "lodash/groupBy.js";
import { TabixIndexedFile } from "@gmod/tabix";

/**
 * Converts numeric strings to numbers, and leaves other values unchanged
 * @param {any} value
 * @returns {any} value
 */
function asNumber(value) {
  return isNaN(value) ? value : Number(value);
}

/**
 * Ensures object property names are camelCase, and any values which are numeric strings are converted to numbers
 * @param {any} object
 * @returns {any}
 */
function formatObject(object, keyFormatter = camelCase, valueFormatter = asNumber) {
  const entries = Object.entries(object).map(([key, value]) => [keyFormatter(key), valueFormatter(value)]);
  return Object.fromEntries(entries);
}

/**
 * Retrieves FORGE data for a given rsid
 * @param {any[]} sources - array of source objects
 * @param {string} rsid - rsid to retrieve data for
 * @returns {Promise<any>} object containing FORGE data for the given rsid
 */
async function getForgeData(sources, rsid) {
  let data = {};

  for (const source of sources) {
    let results = [];

    switch (source.type) {
      case "sqlite":
        results = source.preparedStatement.all(rsid).map((rsid) => formatObject(rsid, camelCase, asNumber));
        break;
      case "tabix":
        const [key, index, fields] = source.query;
        const [chr, start, end] = fields.map((f) => data[key]?.[index]?.[f]);
        await source.connection.getLines(chr, start, end, (line) => results.push(formatObject(rsid, camelCase, asNumber)));
        break;
    }

    if (source.groupBy) {
      results = groupBy(results, source.groupBy);
    }

    data[source.name] = results;
  }

  return data;
}

/**
 * Returns a connection to the given source
 * @param {{type: string, path: string}} source
 * @returns {any} connection
 */
function getSourceConnection({ type, path }) {
  switch (type) {
    case "sqlite":
      return new Database(path, { readonly: true });
    case "tabix":
      return new TabixIndexedFile({ path, tbiPath: path + ".tbi" });
    default:
      throw new Error(`Unknown source type: ${type}`);
  }
}

/**
 * Exports FORGE data for a given set of files
 * @param {{ sources: any[], inputPath: string, outputPath: string, rsidsPath: string, onProgress: function, progressInterval: number}} config
 * @returns {Promise<number>} number of rows processed
 */
async function exportForgeDbFiles({ sources, inputPath, outputPath, rsidsPath, onProgress, progressInterval = 1000 }) {
  mkdirSync(outputPath, { recursive: true });

  for (const source of sources) {
    source.path = path.join(inputPath, source.path);
    source.connection = getSourceConnection(source);
    source.preparedStatement = source.type === "sqlite" && source.connection.prepare(source.query);
  }

  const rsidsReadStream = createReadStream(rsidsPath, { encoding: "utf8" });
  const rsidsReader = createInterface({ input: rsidsReadStream, crlfDelay: Infinity });
  let count = 0;

  for await (const rsid of rsidsReader) {
    const data = await getForgeData(sources, rsid);
    const filePath = path.join(outputPath, `${rsid}.json`);
    const jsonData = JSON.stringify(data);
    writeFileSync(filePath, jsonData);
    if (++count % progressInterval === 0) {
      onProgress(count);
    }
  }

  if (count % progressInterval !== 0) {
    onProgress(count);
  }

  return count;
}

/**
 * Import script entry point
 * @param {string[]} argv
 * @param {any} logger
 */
async function main(argv = process.argv, logger = console) {
  const require = createRequire(import.meta.url);
  const args = minimist(argv.slice(2));

  const sources = require(path.resolve(args.sources || "sources.json"));
  const inputPath = path.resolve(args.inputPath || "input");
  const outputPath = path.resolve(args.outputPath || "output");
  const rsidsPath = path.resolve(args.rsids || "rsids.txt");

  const start = Date.now();
  const onProgress = (count) => {
    const elapsed = (Date.now() - start) / 1000;
    const rate = count / elapsed;
    logger.info(`Processed ${count} rows in ${elapsed.toFixed(2)}s (${rate.toFixed(2)} rows/s)`);
  };

  await exportForgeDbFiles({
    sources,
    inputPath,
    outputPath,
    rsidsPath,
    onProgress,
  });
}

// Only run main() if this file is being run directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await main(process.argv, console);
}
