import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { dynamoClient, productsTableName } from "@libs/dynamodb";

async function getProductsById(
  event: ValidatedEventAPIGatewayProxyEvent<unknown>,
) {
  // @ts-expect-error
  const productId = event.pathParameters.productId;
  const getCmd = new GetItemCommand({
    TableName: productsTableName,
    Key: { id: { S: productId } },
  });

  const { Item } = await dynamoClient.send(getCmd);

  if (Item) {
    return formatJSONResponse({
      id: Item.id.S,
      description: Item.description.S,
      price: Item.price.N,
      title: Item.title.S,
    });
  }

  return formatJSONResponse({
    status: 404,
    message: "NOT_FOUND",
  });
}

export const main = getProductsById;
