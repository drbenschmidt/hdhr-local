import express from 'express';
import expressWs from 'express-ws';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import path from 'path';
import { getEncoders } from '@drbenschmidt/ffmpeg-utils';
import { getStatus, getLineup } from '@drbenschmidt/hdhr-utils';
import { TranscodeManager } from './transcoder/manager';
import { TunerName } from './transcoder/metadata';

const { app } = expressWs(express());
const service = new TranscodeManager();
const startTime = new Date();
const hdhrAddress = '192.168.1.169';
// TODO: Clean temp folder on startup.

const guardValueIn = <T>(input: T, values: T[]): void => {
  if (!values.includes(input)) {
    throw new Error(`${input} is an invalid value for request.`);
  }
};

(async () => {
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

  app.get('/hls/:hdhrAddress/:tuner/:channel', async (req, res) => {
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

  app.get('/hls/:hdhrAddress/:tuner/:channel/:file', async (req, res) => {
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

  app.get('/health', async (req, res) => {
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

  app.get('/ffmpeg/encoders', (req, res) => {
    const encoders = getEncoders();

    res.json(encoders);
  });

  // Import these dynamically because `express-ws` modifies the Router prototype
  // for express and we need that to happen before we import or we'll get an error
  // with `.ws` not existing on Router.
  const socketRouter = await import('./routes/socket');

  app.use(socketRouter.default);

  // TODO: Make this configurable for dev environments, or just serving
  // a static build directory at root for prod.
  app.use('/', proxy('localhost:9000'));

  app.listen(80, () => {
    console.log(`Listening on port 80`);
  });
})();
