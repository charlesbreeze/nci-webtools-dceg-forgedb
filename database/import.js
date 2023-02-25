import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "path";
import minimist from "minimist";
import { exportForgeDbFiles } from "./forge.js";

/**
 * Import script entry point
 * @param {string[]} argv
 * @param {any} logger
 */
async function main(argv = process.argv, logger = console) {
  const require = createRequire(import.meta.url);
  const args = minimist(argv.slice(2));

  const sources = require(path.resolve(args.sources || "sources.json"));
  const inputPath = path.resolve(args.input || "input");
  const outputPath = path.resolve(args.output || "output");
  const rsidsPath = path.resolve(args.rsids || "rsids.txt");
  const rsidsFileName = path.basename(rsidsPath);

  // create a progress callback which logs import statistics
  const start = Date.now();
  const onProgress = (count) => {
    const elapsed = (Date.now() - start) / 1000;
    const rate = count / elapsed;
    logger.info(`[${rsidsFileName}] Processed ${count} rsids in ${elapsed.toFixed(2)}s (${rate.toFixed(2)} rsids/s)`);
  };

  // create FORGEdb output files
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
