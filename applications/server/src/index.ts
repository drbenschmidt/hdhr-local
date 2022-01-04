import express from 'express';
import expressWs from 'express-ws';
import proxy from 'express-http-proxy';
import morgan from 'morgan';

const { app } = expressWs(express());

// TODO: Clean temp folder on startup.

(async () => {
  app.use(morgan('dev'));

  // Import these dynamically because `express-ws` modifies the Router prototype
  // for express and we need that to happen before we import or we'll get an error
  // with `.ws` not existing on Router.
  const socketRouter = await import('./routes/socket');
  const ffmpegRouter = await import('./routes/ffmpeg');
  const guideRouter = await import('./routes/guide');
  const healthRouter = await import('./routes/health');
  const hlsRouter = await import('./routes/hls');
  const transcodeRouter = await import('./routes/transcode');

  app.use(socketRouter.default);
  app.use(ffmpegRouter.default);
  app.use(guideRouter.default);
  app.use(healthRouter.default);
  app.use(hlsRouter.default);
  app.use(transcodeRouter.default);

  // TODO: Make this configurable for dev environments, or just serving
  // a static build directory at root for prod.
  app.use('/', proxy('localhost:9000'));

  app.listen(80, () => {
    console.log(`Listening on port 80`);
  });
})();
