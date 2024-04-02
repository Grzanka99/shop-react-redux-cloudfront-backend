import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { products } from "src/mocks/products";

async function getProductsById(
  event: ValidatedEventAPIGatewayProxyEvent<unknown>,
) {
  const product = products.find(
    (el) => el.id === event.pathParameters.productId,
  );

  if (product) {
    return formatJSONResponse(product);
  }

  return formatJSONResponse({
    status: 404,
    message: "NOT_FOUND",
  });
}

export const main = middyfy(getProductsById);
