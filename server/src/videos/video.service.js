import { randomUUID } from 'crypto';
import path from 'path';
import { AppError } from '../utils/errors.js';
import { getPresignedUploadUrl, loadS3Config } from '../config/s3.js';
import { saveVideoMetadata, fetchVideoMetadata } from './video.repo.js';

const DEFAULT_OWNER_ID = 'anonymous';
const DEFAULT_PREFIX = 'uploads/raw';

function sanitizeKeySegment(value, fallback) {
  const stringValue = String(value ?? '').trim();
  if (!stringValue) {
    return fallback;
  }

  const sanitized = stringValue
    .replace(/[^A-Za-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || fallback;
}

function normalizePrefix(prefix) {
  const value = prefix ? String(prefix) : DEFAULT_PREFIX;
  const trimmed = value.replace(/^\/+|\/+$/g, '');
  return trimmed || DEFAULT_PREFIX;
}

function buildS3Key(prefix, ownerId, videoId, filename) {
  const normalizedPrefix = normalizePrefix(prefix);
  const ownerSegment = sanitizeKeySegment(ownerId, DEFAULT_OWNER_ID);
  const extension = path.extname(filename || '').replace(/[^A-Za-z0-9.]/g, '').slice(0, 10);
  const fileName = `${videoId}${extension}`;
  return [normalizedPrefix, ownerSegment, fileName]
    .filter(Boolean)
    .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
    .join('/');
}

function normaliseSize(sizeBytes) {
  if (typeof sizeBytes !== 'number' || !Number.isFinite(sizeBytes)) {
    return null;
  }

  const safe = Math.max(0, Math.floor(sizeBytes));
  return Number.isFinite(safe) ? safe : null;
}

function coerceOwnerId(ownerId) {
  if (!ownerId) {
    return DEFAULT_OWNER_ID;
  }
  return String(ownerId);
}

async function resolveS3Config() {
  try {
    return await loadS3Config();
  } catch (error) {
    console.error('Failed to load S3 configuration:', error.message);
    throw new AppError('Failed to load S3 configuration', 500, 'S3_CONFIG_ERROR');
  }
}

export async function createVideoUpload(ownerId, fileMetadata = {}) {
  const { filename, contentType, sizeBytes } = fileMetadata;

  if (!filename) {
    throw new AppError('Filename is required to create an upload URL', 400, 'NO_FILENAME');
  }

  const s3Config = await resolveS3Config();

  if (!s3Config?.S3_BUCKET) {
    throw new AppError('S3 bucket is not configured', 500, 'S3_CONFIG_MISSING');
  }

  const videoId = randomUUID();
  const now = new Date();
  const ownerValue = coerceOwnerId(ownerId);
  const s3Key = buildS3Key(s3Config.RAW_PREFIX, ownerValue, videoId, filename);
  const mimeType = contentType || 'application/octet-stream';
  const uploadUrl = await getPresignedUploadUrl(s3Key, mimeType, s3Config.PRESIGNED_TTL_SECONDS);
  const expiresAt = new Date(now.getTime() + (s3Config.PRESIGNED_TTL_SECONDS ?? 900) * 1000);

  const record = {
    videoId,
    ownerId: ownerValue,
    originalName: filename,
    s3Key,
    status: 'pending-upload',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    contentType: mimeType,
    sizeBytes: normaliseSize(sizeBytes)
  };

  const stored = await saveVideoMetadata(record);

  return {
    uploadUrl,
    expiresAt: expiresAt.toISOString(),
    video: {
      ...stored,
      id: stored?.id ?? videoId
    }
  };
}

export async function listVideos(ownerId, page = 1, limit = 10) {
  const ownerValue = coerceOwnerId(ownerId);

  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  const allVideos = await fetchVideoMetadata(ownerValue);
  const sortedVideos = allVideos
    .slice()
    .sort((a, b) => {
      const aTime = a?.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b?.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });
  const start = (safePage - 1) * safeLimit;
  const paged = sortedVideos.slice(start, start + safeLimit);

  return {
    total: sortedVideos.length,
    items: paged.map((item) => ({
      ...item,
      id: item.id ?? item.videoId,
      status: item.status ?? 'pending-upload'
    }))
  };
}

export function getVideoById() {
  throw new AppError('Direct video lookup is not implemented for the AWS storage flow', 501, 'NOT_IMPLEMENTED');
}

export async function deleteVideoRecord() {
  throw new AppError('Video deletion is not implemented for the AWS storage flow', 501, 'NOT_IMPLEMENTED');
}
