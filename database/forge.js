import path from "path";
import { createReadStream, mkdirSync, writeFileSync } from "fs";
import { createInterface } from "readline/promises";
import { TabixIndexedFile } from "@gmod/tabix";
import Database from "better-sqlite3";
import camelCase from "lodash/camelCase.js";
import groupBy from "lodash/groupBy.js";

/**
 * Exports FORGEdb data for a given set of files
 * @param {{ sources: any[], inputPath: string, outputPath: string, rsidsPath: string, onProgress: function, progressInterval: number}} config
 * @returns {Promise<number>} number of rows processed
 */
export async function exportForgeDbFiles({ sources, inputPath, outputPath, rsidsPath, onProgress = () => {}, progressInterval = 1000 }) {
  mkdirSync(outputPath, { recursive: true });

  // ensure source paths are relative to the input path, and create connections for each source
  for (const source of sources) {
    source.path = path.join(inputPath, source.path);
    source.connection = getSourceConnection(source);
    if (source.type === "sqlite") {
      source.preparedStatement = source.connection.prepare(source.query);
    }
  }

  // create a readline interface to read the rsids file line by line
  const rsidsReadStream = createReadStream(rsidsPath, { encoding: "utf8" });
  const rsidsReader = createInterface({ input: rsidsReadStream, crlfDelay: Infinity });
  let count = 0;

  // for each rsid, retrieve FORGE data and write it to a file
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
 * Retrieves FORGE data for a given rsid
 * @param {any[]} sources - array of source objects
 * @param {string} rsid - rsid to retrieve data for
 * @returns {Promise<any>} object containing FORGE data for the given rsid
 */
export async function getForgeData(sources, rsid) {
  let data = {};

  for (const source of sources) {
    let results = [];

    switch (source.type) {
      case "sqlite":
        // retrieve results from executing the prepared statement for the given rsid
        results = source.preparedStatement.all(rsid);
        break;
      case "tabix":
        // determine tabix coordinates from the source query
        const [key, index, fields] = source.query;
        const [chr, start, end] = fields.map((field) => data[key]?.[index]?.[field]);
        if (chr && start && end) {
          await source.connection.getLines(chr, start, end, (line) => results.push(line));
        }
        break;
    }

    // format results
    results = results.map((result) => formatObject(result, camelCase, asNumber));

    // group results by a given field
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
export function getSourceConnection({ type, path }) {
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
 * Converts numeric strings to numbers, and leaves other values unchanged
 * @param {any} value
 * @returns {any} value
 */
export function asNumber(value) {
  return isNaN(value) ? value : Number(value);
}

/**
 * Ensures object property names are camelCase, and any values which are numeric strings are converted to numbers
 * @param {any} object
 * @returns {any}
 */
export function formatObject(object, keyFormatter = camelCase, valueFormatter = asNumber) {
  const entries = Object.entries(object).map(([key, value]) => [keyFormatter(key), valueFormatter(value)]);
  return Object.fromEntries(entries);
}
