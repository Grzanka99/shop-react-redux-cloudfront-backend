import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "src/mocks/products";

async function getProductsList(
  event: ValidatedEventAPIGatewayProxyEvent<unknown>,
) {
  return formatJSONResponse(products);
}

export const main = middyfy(getProductsList);
