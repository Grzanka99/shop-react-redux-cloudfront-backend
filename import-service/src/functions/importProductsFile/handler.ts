import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { S3_BUCKET_NAME } from "src/consts";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event,
) => {
  const { name } = event.queryStringParameters;

  const s3 = new S3Client({ region: "eu-central-1" });

  const cmd = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: `uploaded/${name}`,
  });

  const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 3600 });

  return formatJSONResponse({
    data: signedUrl,
  });
};

export const main = importProductsFile;
