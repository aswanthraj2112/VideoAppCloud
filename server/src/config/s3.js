import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "ap-southeast-2" });
const BUCKET_NAME = process.env.S3_BUCKET;

export async function getPresignedUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 900 }); // 15 min
}

// Keep the existing config for backward compatibility
import { getParameters, getParameterWithDefault } from '../utils/parameterStore.js';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
let configPromise;

export async function loadS3Config() {
  if (!configPromise) {
    configPromise = (async () => {
      try {
        const params = await getParameters([
          's3Bucket',
          's3_raw_prefix',
          's3_transcoded_prefix',
          's3_thumbnail_prefix'
        ]);

        const preSignedTTL = await getParameterWithDefault('preSignedUrlTTL', '600');

        return {
          REGION,
          S3_BUCKET: params.s3Bucket,
          RAW_PREFIX: params.s3_raw_prefix,
          TRANSCODED_PREFIX: params.s3_transcoded_prefix,
          THUMB_PREFIX: params.s3_thumbnail_prefix,
          PRESIGNED_TTL_SECONDS: Number.parseInt(preSignedTTL, 10)
        };
      } catch (error) {
        console.error('❌ Failed to load S3 configuration from Parameter Store:', error.message);
        throw error;
      }
    })();
  }
  return configPromise;
}
