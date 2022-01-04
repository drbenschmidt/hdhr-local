import express from 'express';
import { globalInstance as service } from '../transcoder/manager';
import { TunerName } from '../transcoder/metadata';

const router = express.Router();

const guardValueIn = <T>(input: T, values: T[]): void => {
  if (!values.includes(input)) {
    throw new Error(`${input} is an invalid value for request.`);
  }
};

router.get('/transcode/:addr/:tuner/:channel/webm', (req, res) => {
  try {
    const { addr, tuner, channel } = req.params;

    guardValueIn(tuner, ['auto', 'tuner0', 'tuner1', 'tuner2', 'tuner3']);

    // Setup the response so the client knows what we're going to deliver.
    res.header('Content-Type', 'video/webm;codecs=vp8,opus');
    service.addStreamer({
      hdhrAddress: addr,
      channel,
      tuner: tuner as TunerName,
      outputType: 'webm'
    }, req, res);
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  }
});

export default router;
