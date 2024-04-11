import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";
import { S3_BUCKET_NAME } from "src/consts";

const serverlessConfiguration: AWS = {
  service: "cloudx-backend-import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:PutBucketNotification", // Permission to add S3 notification configuration
              "s3:ListBucket", // Permission to list buckets (might be needed depending on your setup)
            ],
            Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}`],
          },
          {
            Effect: "Allow",
            Action: "s3:*",
            Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}`],
          },
        ],
      },
    },
  },
  functions: {
    importProductsFile,
    importFileParser,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
