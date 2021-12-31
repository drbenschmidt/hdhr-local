import express from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import { getEncoders } from '@drbenschmidt/ffmpeg-utils';
import { getStatus, getLineup } from '@drbenschmidt/hdhr-utils';
import { TranscodeManager } from './transcoder/manager';
import { TunerName } from './transcoder/metadata';

const app = express();
const service = new TranscodeManager();
const startTime = new Date();
const hdhrAddress = '192.168.1.169';

const guardValueIn = <T>(input: T, values: T[]): void => {
  if (!values.includes(input)) {
    throw new Error(`${input} is an invalid value for request.`);
  }
};

app.use(morgan('dev'));

app.get('/transcode/:addr/:tuner/:channel/webm', (req, res) => {
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

app.get('hls/:hdhrAddress/:tuner/:channel', async (req, res) => {
  try {
    const { hdhrAddress, tuner, channel } = req.params;

    guardValueIn(tuner, ['auto', 'tuner0', 'tuner1', 'tuner2', 'tuner3']);

    service.addStreamer({
      hdhrAddress,
      channel,
      tuner: tuner as TunerName,
      outputType: 'hls'
    }, req, res);
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  }
});

app.get('/health', async (req, res, next) => {
  const hdhrStatus = await getStatus(hdhrAddress);

  res.json({
    alive: true,
    startTime,
    uptime: (new Date().getTime() - startTime.getTime()),
    hdhrStatus,
  });
});

app.get('/guide', async (req, res) => {
  const lineup = await getLineup(hdhrAddress);

  res.json(lineup.map((v) => {
    return {
      name: v.GuideName,
      number: v.GuideNumber
    }
  }));
});

app.use('/hls', express.static('../../tmp'));

app.get('/ffmpeg/encoders', (req, res) => {
  const encoders = getEncoders();

  res.json(encoders);
});

// TODO: Make this configurable for dev environments, or just serving
// a static build directory at root for prod.
app.use('/', proxy('localhost:9000'));

app.listen(80, () => {
  console.log(`Listening on port 80`);
});
