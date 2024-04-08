import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoClient = new DynamoDBClient({ region: "eu-central-1" });
export const productsTableName = "AWS_CloudX_Products";
export const stocksTableName = "AWS_CloudX_Stocks";
