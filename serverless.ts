import type { AWS } from "@serverless/typescript";

import getProductList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";

const serverlessConfiguration: AWS = {
  service: "shop-react-redux-cloudfront-backend",
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
    iamManagedPolicies: ["arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"],
  },
  // import the function via paths
  functions: {
    getProductList,
    getProductsById,
    createProduct,
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
  resources: {
    Resources: {
      ProductsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "AWS_CloudX_Products",
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
      StocksTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "AWS_CloudX_Stocks",
          AttributeDefinitions: [
            { AttributeName: "product_id", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
