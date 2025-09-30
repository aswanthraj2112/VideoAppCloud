import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getParameters, getParameterWithDefault } from '../utils/parameterStore.js';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
let configPromise;
let cachedClientRegion = REGION;
let cachedClient = new S3Client({ region: REGION });

function buildFallbackConfig() {
  const ttl = Number.parseInt(process.env.PRESIGNED_URL_TTL || '900', 10);

  return {
    REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    RAW_PREFIX: process.env.S3_RAW_PREFIX || 'uploads/raw',
    TRANSCODED_PREFIX: process.env.S3_TRANSCODED_PREFIX || 'uploads/transcoded',
    THUMB_PREFIX: process.env.S3_THUMB_PREFIX || 'uploads/thumbs',
    PRESIGNED_TTL_SECONDS: Number.isFinite(ttl) ? ttl : 900
  };
}

function getS3Client(region) {
  if (!cachedClient || cachedClientRegion !== region) {
    cachedClient = new S3Client({ region });
    cachedClientRegion = region;
  }
  return cachedClient;
}

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
        const fallback = buildFallbackConfig();
        if (fallback.S3_BUCKET) {
          console.warn('⚠️  Falling back to environment-based S3 configuration:', error.message);
          return fallback;
        }

        console.error('❌ Failed to load S3 configuration from Parameter Store:', error.message);
        throw error;
      }
    })();
  }
  return configPromise;
}

export async function getPresignedUploadUrl(key, contentType, ttlSeconds) {
  const config = await loadS3Config();

  if (!config.S3_BUCKET) {
    throw new Error('S3 bucket is not configured.');
  }

  const expiresIn = ttlSeconds ?? config.PRESIGNED_TTL_SECONDS ?? 900;
  const client = getS3Client(config.REGION || REGION);
  const command = new PutObjectCommand({
    Bucket: config.S3_BUCKET,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(client, command, { expiresIn });
}
