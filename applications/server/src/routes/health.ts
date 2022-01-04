import express from 'express';
import { getStatus } from '@drbenschmidt/hdhr-utils';

const startTime = new Date();
const hdhrAddress = '192.168.1.169';

const router = express.Router();

router.get('/health', async (req, res) => {
  const hdhrStatus = await getStatus(hdhrAddress);

  res.json({
    alive: true,
    startTime,
    uptime: (new Date().getTime() - startTime.getTime()),
    hdhrStatus,
  });
});

export default router;
