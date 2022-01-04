import express from 'express';
import { getEncoders } from '@drbenschmidt/ffmpeg-utils';

const router = express.Router();

router.get('/ffmpeg/encoders', (req, res) => {
  const encoders = getEncoders();

  res.json(encoders);
});

export default router;
