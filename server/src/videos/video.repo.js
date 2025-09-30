let repoPromise;

async function loadRepo() {
  if (!repoPromise) {
    const useDynamo = process.env.USE_DYNAMO === 'true';
    repoPromise = useDynamo
      ? import('./video.repo.dynamo.js')
      : import('./video.repo.sqlite.js');
  }
  return repoPromise;
}

export async function createVideo(video) {
  const repo = await loadRepo();
  return repo.createVideo(video);
}

export async function getVideo(userId, videoId) {
  const repo = await loadRepo();
  return repo.getVideo(userId, videoId);
}

export async function listVideos(userId, page, limit) {
  const repo = await loadRepo();
  return repo.listVideos(userId, page, limit);
}

export async function updateVideo(userId, videoId, updates) {
  const repo = await loadRepo();
  return repo.updateVideo(userId, videoId, updates);
}

export async function deleteVideo(userId, videoId) {
  const repo = await loadRepo();
  return repo.deleteVideo(userId, videoId);
}

// New minimal repository functions for DynamoDB
import { dynamoClient, TABLE_NAME } from "../config/dynamo.js";
import { resolveDynamoConfig } from "../config/dynamo.js";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const fallbackMetadataStore = new Map();
let cachedDynamoConfig;

async function getDynamoConfig() {
  if (cachedDynamoConfig !== undefined) {
    return cachedDynamoConfig;
  }

  try {
    cachedDynamoConfig = await resolveDynamoConfig();
  } catch (error) {
    console.warn('⚠️  Falling back to in-memory video metadata store:', error.message);
    cachedDynamoConfig = null;
  }

  return cachedDynamoConfig;
}

function addStringAttribute(item, key, value) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  item[key] = { S: String(value) };
}

function mapDynamoItemToVideo(item) {
  if (!item) {
    return null;
  }

  const sizeValue = item.sizeBytes?.S ?? item.sizeBytes?.N;

  return {
    id: item.videoId?.S,
    videoId: item.videoId?.S,
    ownerId: item.ownerId?.S,
    originalName: item.originalName?.S ?? item.filename?.S ?? '',
    s3Key: item.s3Key?.S,
    status: item.status?.S ?? 'unknown',
    createdAt: item.createdAt?.S,
    updatedAt: item.updatedAt?.S ?? item.createdAt?.S,
    contentType: item.contentType?.S ?? null,
    sizeBytes: sizeValue ? Number.parseInt(sizeValue, 10) : null
  };
}

export async function saveVideoMetadata(item) {
  const config = await getDynamoConfig();

  if (!config?.TABLE && !TABLE_NAME) {
    fallbackMetadataStore.set(item.videoId, { ...item, id: item.videoId });
    return { ...item, id: item.videoId };
  }

  const tableName = config?.TABLE ?? TABLE_NAME;
  const putItem = {};

  addStringAttribute(putItem, 'ownerId', item.ownerId);
  addStringAttribute(putItem, 'videoId', item.videoId);
  addStringAttribute(putItem, 's3Key', item.s3Key);
  addStringAttribute(putItem, 'originalName', item.originalName ?? item.filename);
  addStringAttribute(putItem, 'status', item.status);
  addStringAttribute(putItem, 'createdAt', item.createdAt);
  addStringAttribute(putItem, 'updatedAt', item.updatedAt);
  addStringAttribute(putItem, 'contentType', item.contentType);
  addStringAttribute(putItem, 'sizeBytes', item.sizeBytes);

  const command = new PutItemCommand({
    TableName: tableName,
    Item: putItem
  });

  await dynamoClient.send(command);

  return { ...item, id: item.videoId };
}

export async function fetchVideoMetadata(ownerId) {
  const config = await getDynamoConfig();

  if (!config?.TABLE && !TABLE_NAME) {
    return Array.from(fallbackMetadataStore.values()).filter((item) => item.ownerId === ownerId);
  }

  const tableName = config?.TABLE ?? TABLE_NAME;
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "ownerId = :o",
    ExpressionAttributeValues: {
      ":o": { S: ownerId }
    },
    ScanIndexForward: false
  });

  const result = await dynamoClient.send(command);
  return (result.Items || [])
    .map(mapDynamoItemToVideo)
    .filter(Boolean);
}
