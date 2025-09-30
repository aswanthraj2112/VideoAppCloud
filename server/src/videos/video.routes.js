import express from 'express';
import { z } from 'zod';
import asyncHandler from '../utils/asyncHandler.js';
import { validateBody } from '../utils/validate.js';
import { createVideoUpload, listVideos } from './video.service.js';

const router = express.Router();

const uploadRequestSchema = z.object({
  ownerId: z.string().trim().min(1).optional(),
  filename: z.string().min(1, 'Filename is required'),
  contentType: z.string().min(1).optional(),
  sizeBytes: z.number().int().nonnegative().optional()
});

router.post(
  '/upload',
  validateBody(uploadRequestSchema),
  asyncHandler(async (req, res) => {
    const { ownerId, filename, contentType, sizeBytes } = req.validatedBody;
    const result = await createVideoUpload(ownerId, { filename, contentType, sizeBytes });
    res.status(201).json(result);
  })
);

const listQuerySchema = z.object({
  ownerId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { ownerId, page, limit } = listQuerySchema.parse(req.query);
    const result = await listVideos(ownerId, page, limit);
    res.json(result);
  })
);

export default router;
