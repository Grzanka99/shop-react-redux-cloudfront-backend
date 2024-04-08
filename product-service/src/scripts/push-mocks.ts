import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {
  dynamoClient,
  productsTableName,
  stocksTableName,
} from "@libs/dynamodb";
import { products, stocks } from "src/mocks/products";

async function insertProducts() {
  products.forEach(async (product) => {
    const getCmd = new GetItemCommand({
      TableName: productsTableName,
      Key: { id: { S: product.id } },
    });

    const isThere = await dynamoClient.send(getCmd);
    if (isThere.Item) {
      console.log(`Skipping for product of id: ${product.id}`);
      return;
    }

    const putCmd = new PutItemCommand({
      TableName: productsTableName,
      Item: {
        id: { S: product.id },
        title: { S: product.title },
        description: { S: product.description },
        price: { N: `${product.price}` },
      },
    });

    try {
      await dynamoClient.send(putCmd);
      console.log(`Product of id: ${product.id} inserted`);
    } catch (_) {}
  });
}

async function insertStocs() {
  stocks.forEach(async (stock) => {
    const putCmd = new PutItemCommand({
      TableName: stocksTableName,
      Item: {
        product_id: { S: stock.product_id },
        count: { N: `${stock.count}` },
      },
    });

    try {
      await dynamoClient.send(putCmd);
      console.log(
        `Product of id: ${stock.product_id} set to stock: ${stock.count}`,
      );
    } catch (_) {}
  });
}

insertProducts();
insertStocs();
