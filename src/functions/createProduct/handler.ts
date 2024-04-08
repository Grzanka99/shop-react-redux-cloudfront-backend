import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { dynamoClient, productsTableName } from "@libs/dynamodb";
import jsonBodyParser from "@middy/http-json-body-parser";
import { v4 as uuidv4 } from "uuid";

export type TCreateProduct = {
  description: string;
  price: number;
  title: string;
};

async function createProduct(
  event: ValidatedEventAPIGatewayProxyEvent<unknown>,
) {
  // @ts-expect-error
  const payload: TCreateProduct = JSON.parse(event.body.replace(/\n|\t/g, ""));

  const id = uuidv4();

  try {
    const putCmd = new PutItemCommand({
      TableName: productsTableName,
      Item: {
        id: { S: id },
        description: { S: payload.description },
        title: { S: payload.title },
        price: { N: String(payload.price) },
      },
    });

    await dynamoClient.send(putCmd);
    return formatJSONResponse({
      id,
      ...payload,
    });
  } catch (e) {
    return formatJSONResponse({
      message: "Internal server error",
      code: 500,
    });
  }
}

export const main = createProduct;
