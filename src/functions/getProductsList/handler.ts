import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { formatJSONResponse } from "@libs/api-gateway";
import {
  dynamoClient,
  productsTableName,
  stocksTableName,
} from "@libs/dynamodb";

async function getProductsList() {
  try {
    const scanProductsCommand = new ScanCommand({
      TableName: productsTableName,
    });
    const scanStoctsCommand = new ScanCommand({
      TableName: stocksTableName,
    });

    const [products, stocks] = await Promise.all([
      dynamoClient.send(scanProductsCommand),
      dynamoClient.send(scanStoctsCommand),
    ]);

    return formatJSONResponse(
      products.Items.map((el) => {
        const stockValue = stocks.Items.find(
          (stck) => stck.product_id.S === el.id.S,
        );
        return {
          id: el.id.S,
          price: el.price.N,
          title: el.title.S,
          description: el.description.S,
          count: stockValue ? stockValue.count.N : 0,
        };
      }),
    );
  } catch (_) {
    return formatJSONResponse({
      message: "Internal server error",
    });
  }
}

export const main = getProductsList;
