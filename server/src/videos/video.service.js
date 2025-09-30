import { randomUUID } from 'crypto';
import config from '../config.js';
import { AppError } from '../utils/errors.js';

const inMemoryStore = new Map();

const buildPublicPaths = (record) => {
  if (!config.USE_LOCAL_STORAGE) {
    return {
      streamPath: null,
      thumbPath: null
    };
  }

  return {
    streamPath: `/static/videos/${record.storedFilename}`,
    thumbPath: record.thumbFilename ? `/static/thumbs/${record.thumbFilename}` : null
  };
};

const mapRecord = (record) => {
  const { streamPath, thumbPath } = buildPublicPaths(record);
  return {
    id: record.id,
    ownerId: record.ownerId,
    originalName: record.originalName,
    storedFilename: record.storedFilename,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
    status: record.status,
    durationSec: record.durationSec ?? null,
    width: record.width ?? null,
    height: record.height ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    thumbPath,
    transcodedFilename: record.transcodedFilename ?? null,
    streamPath
  };
};

export async function createVideoUpload(ownerId = 'anonymous', file) {
  if (!file) {
    throw new AppError('No file uploaded', 400, 'NO_FILE');
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  const record = {
    id,
    ownerId,
    originalName: file.originalname,
    storedFilename: file.filename,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    status: 'uploaded',
    durationSec: null,
    width: null,
    height: null,
    createdAt: now,
    updatedAt: now,
    thumbFilename: null,
    transcodedFilename: null
  };

  inMemoryStore.set(id, record);
  return mapRecord(record);
}

export async function listVideos(ownerId, page = 1, limit = 10) {
  let records = Array.from(inMemoryStore.values());
  if (ownerId) {
    records = records.filter((record) => record.ownerId === ownerId);
  }

  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const start = (safePage - 1) * safeLimit;
  const paged = records.slice(start, start + safeLimit);

  return {
    total: records.length,
    items: paged.map(mapRecord)
  };
}

export function getVideoById(videoId) {
  return inMemoryStore.get(videoId) ?? null;
}

export async function deleteVideoRecord(videoId) {
  inMemoryStore.delete(videoId);
}
