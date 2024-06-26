import { AttributeValue } from "@aws-sdk/client-dynamodb";

export type TProduct = {
  id: string;
  description: string;
  price: number;
  title: string;
};

export type TDBProduct = {
  id: AttributeValue;
  description: AttributeValue;
  price: AttributeValue;
  title: AttributeValue;
};

export const products: TProduct[] = [
  {
    description: "Short Product Description1",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 24,
    title: "ProductOne",
  },
  {
    description: "Short Product Description7",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 15,
    title: "ProductTitle",
  },
  {
    description: "Short Product Description2",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "Product",
  },
  {
    description: "Short Product Description4",
    id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    price: 15,
    title: "ProductTest",
  },
  {
    description: "Short Product Descriptio1",
    id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    price: 23,
    title: "Product2",
  },
  {
    description: "Short Product Description7",
    id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    price: 15,
    title: "ProductName",
  },
];

export type EStock = {
  product_id: string;
  count: number;
};

export const stocks: EStock[] = products.map((el, i) => ({
  product_id: el.id,
  count: i + 1,
}));
