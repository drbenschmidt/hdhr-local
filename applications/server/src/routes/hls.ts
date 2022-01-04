import express from 'express';
import path from 'path';
import { globalInstance as service } from '../transcoder/manager';
import { TunerName } from '../transcoder/metadata';

const router = express.Router();

const guardValueIn = <T>(input: T, values: T[]): void => {
  if (!values.includes(input)) {
    throw new Error(`${input} is an invalid value for request.`);
  }
};

router.get('/hls/:hdhrAddress/:tuner/:channel', async (req, res) => {
  try {
    const { hdhrAddress, tuner, channel } = req.params;

    guardValueIn(tuner, ['auto', 'tuner0', 'tuner1', 'tuner2', 'tuner3']);

    await service.addStreamer({
      hdhrAddress,
      channel,
      tuner: tuner as TunerName,
      outputType: 'hls'
    }, req, res);

    res.json({
      src: `http://192.168.1.116/hls/${hdhrAddress}/${tuner}/${channel}/main.m3u8`
    });
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  }
});

router.get('/hls/:hdhrAddress/:tuner/:channel/:file', async (req, res) => {
  try {
    const { hdhrAddress, tuner, channel, file } = req.params;

    guardValueIn(tuner, ['auto', 'tuner0', 'tuner1', 'tuner2', 'tuner3']);

    const filePath = path.resolve(`./temp/hls/${hdhrAddress}/${tuner}/${channel}/${file}`);

    console.log(`Sending ${filePath}`);

    // TODO: Make sure these values are sanitized.
    res.sendFile(filePath, (err) => {
      console.error(err);
    });
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  }
});

export default router;
