import { createGunzip } from "zlib";
import { setTimeout } from "timers/promises";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { parse } from 'csv-parse';
import dotenv from 'dotenv';

dotenv.config();

const bucket = process.env.S3_BUCKET_NAME;
const key = process.env.S3_OBJECT_KEY;

if (!bucket || !key) {
  throw new Error('Missing required environment variables');
}

console.log(`Input object key: s3://${bucket}/${key}`);
const keyParts = key.split('/');
const [datasetName, version] = keyParts.slice(-3, -1);
const outputKeyPrefix = keyParts.slice(0, -1).join('/') + '/';
const indexKey = `${keyParts.slice(0, -3).join('/')}/datasets.json`

if (datasetName === 'api' || version === 'api') {
  throw new Error('Invalid dataset name or version: ');
}

console.log(`Output object key prefix: s3://${bucket}/${outputKeyPrefix}`);
console.log(`Index key: s3://${bucket}/${indexKey}`);

async function main() {
  const s3Client = new S3Client({ 
    maxAttempts: 40,
    retryMode: 'adaptive',
  });

  const response = await s3Client.send(new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  }));

  const gunzip = createGunzip();
  const parser = parse({
    delimiter: ',',
    columns: true,
    bom: true,
  });

  let i = 0;
  let objectCount = 0;
  let start = Date.now();
  let previousRsid = null;
  let previousItems = [];
  let buffer = [];
  let bufferSize = 100;
  let logInterval = 100000;

  let flushBuffer = async () => {
    for (let { Key, Body } of buffer) {
      let contents = JSON.parse(Body);
      let rsid = contents.rsid;
      let data = contents.data;
      let isValid = data.every((item) => item.rsid === rsid);
      if (!isValid) {
        console.error(`Invalid data for ${rsid}`);
        console.error(data);
        throw new Error(`Invalid data for ${rsid}`);
      }
    }

    let promises = buffer.map(async (args) => {
      try {
        await setTimeout(Math.random() * 100);
        return s3Client.send(new PutObjectCommand(args))
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
    await Promise.all(promises);
    objectCount += buffer.length;
    buffer = [];
  }

  for await (const item of response.Body.pipe(gunzip).pipe(parser)) {
    // initialize previousRsid if it's null
    if (!previousRsid) {
      previousRsid = item.rsid;
    }

    // if the rsid has changed, flush the buffer
    if (item.rsid !== previousRsid) {
      buffer.push({
        Bucket: bucket,
        Key: `${outputKeyPrefix}${previousRsid}.json`,
        Body: JSON.stringify({
          rsid: previousRsid,
          data: previousItems,
        }),
      });
      previousRsid = item.rsid;
      previousItems = [item];
    } else {
      previousItems.push(item);
    }

    if (i % bufferSize === 0) {
      await flushBuffer();
    }

    if (i % logInterval === 0) {
      let end = Date.now();
      let elapsed = (end - start) / 1000;
      let rate = i / elapsed;
      let objectRate = objectCount / elapsed;
      console.log(`Processed ${i} rows (${objectCount} objects) in ${elapsed.toFixed(2)}s (${rate.toFixed(2)} rows/s) (${objectRate.toFixed(2)} objects/s)`);
    }

    i++;
  }

  if (previousItems.length > 0) {
    const rsid = previousItems[0].rsid;
    buffer.push({
      Bucket: bucket,
      Key:  `${outputKeyPrefix}${rsid}.json`,
      Body: JSON.stringify({
        rsid,
        data: previousItems,
      }),
    });
  }

  await flushBuffer();

  let end = Date.now();
  let elapsed = (end - start) / 1000;
  let rate = i / elapsed;
  let objectRate = objectCount / elapsed;
  console.log(`Processed ${i} rows (${objectCount} objects) in ${elapsed.toFixed(2)}s (${rate.toFixed(2)} rows/s) (${objectRate.toFixed(2)} objects/s)`);


  // update the index file
  const indexResponse = await s3Client.send(new GetObjectCommand({
    Bucket: bucket,
    Key: indexKey,
  }));

  let indexResponseContents = "";
  for await (const chunk of indexResponse.Body) {
    indexResponseContents += chunk;
  }

  const datasets = JSON.parse(indexResponseContents);
  let dataset = datasets.find(d => d.name === datasetName);
  if (!dataset) {
    dataset = {
      name: dataset,
      versions: [],
    };
    datasets.push(dataset);
  }

  if (!dataset.versions.find(v => v === version)) {
    console.log(`Updating s3://${bucket}/${indexKey}`);
    dataset.versions.unshift(version);
    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: indexKey,
      Body: JSON.stringify(datasets, null, 2),
    }));
  }
}

try {
  await main();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
