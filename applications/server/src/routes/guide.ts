import express from 'express';
import { getLineup } from '@drbenschmidt/hdhr-utils';

const hdhrAddress = '192.168.1.169';

const router = express.Router();

router.get('/guide', async (req, res) => {
  const lineup = await getLineup(hdhrAddress);

  res.json(lineup.map((v) => {
    return {
      name: v.GuideName,
      number: v.GuideNumber
    }
  }));
});

export default router;
