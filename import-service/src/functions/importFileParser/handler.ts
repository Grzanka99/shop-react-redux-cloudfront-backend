// @ts-expect-error
import csv from "csv-parser";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME } from "src/consts";
import { S3EventRecord } from "aws-lambda";
import { logger } from "@cgsh/utils";

const importProductsFile = async (event: any) => {
  const Records: S3EventRecord[] | undefined = event.Records;

  if (!Records) {
    logger.warning("No records found for importProductsFile lambda");
  }

  const s3client = new S3Client({ region: "eu-central-1" });
  for (const record of Records) {
    const { key } = record.s3.object;

    const getCmd = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });
    const res = await s3client.send(getCmd);

    const rescsv = [];
    await new Promise((resolve, reject) => {
      res.Body?.pipe(csv())
        .on("data", (data: unknown) => {
          rescsv.push(data);
        })
        .on("error", reject)
        .on("end", resolve);
    });

    const newKey = key.replace("uploaded", "parsed").replace(".csv", ".json");

    try {
      const putCmd = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: newKey,
        Body: JSON.stringify(rescsv),
      });

      await s3client.send(putCmd);
      logger.info(`File parsed and copied to: ${newKey}`);
    } catch (_) {
      logger.error(`Something went wrong while parsing record: ${key} `);
    }

    try {
      const delCmd = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      });
      logger.info(`Deleting record ${key}`);
      await s3client.send(delCmd);
    } catch (_) {
      logger.info(`Something went wrong while deleting record: ${key} `);
    }
  }
};

export const main = importProductsFile;
