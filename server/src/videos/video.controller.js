import fs from 'fs/promises';
import path from 'path';
import config from '../config.js';
import { AppError } from '../utils/errors.js';

// Ensure storage directories exist
export async function ensureStorageDirs() {
  if (config.USE_LOCAL_STORAGE) {
    try {
      await fs.mkdir(config.PUBLIC_VIDEOS_DIR, { recursive: true });
      await fs.mkdir(config.PUBLIC_THUMBS_DIR, { recursive: true });
      console.log('📁 Storage directories ensured');
    } catch (error) {
      console.error('❌ Failed to create storage directories:', error);
    }
  }
}

// Placeholder controller functions for existing routes
export async function uploadVideo(req, res) {
  throw new AppError('Use the new /api/videos/upload endpoint for presigned URLs', 501, 'NOT_IMPLEMENTED');
}

export async function listUserVideos(req, res) {
  throw new AppError('Use the new /api/videos endpoint with ownerId query parameter', 501, 'NOT_IMPLEMENTED');
}

export async function getVideo(req, res) {
  throw new AppError('Video retrieval not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function streamVideo(req, res) {
  throw new AppError('Video streaming not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function requestTranscode(req, res) {
  throw new AppError('Video transcoding not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function serveThumbnail(req, res) {
  throw new AppError('Thumbnail serving not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function removeVideo(req, res) {
  throw new AppError('Video removal not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}