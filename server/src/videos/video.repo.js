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
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

export async function saveVideoMetadata(item) {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      videoId: { S: item.videoId },
      ownerId: { S: item.ownerId },
      filename: { S: item.filename },
      s3Key: { S: item.s3Key },
      status: { S: item.status },
      createdAt: { S: item.createdAt },
    },
  });
  await dynamoClient.send(command);
}

export async function fetchVideoMetadata(ownerId) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "ownerId = :o",
    ExpressionAttributeValues: {
      ":o": { S: ownerId },
    },
  });
  const result = await dynamoClient.send(command);
  return result.Items.map((item) => ({
    videoId: item.videoId.S,
    filename: item.filename.S,
    s3Key: item.s3Key.S,
    status: item.status.S,
    createdAt: item.createdAt.S,
  }));
}
