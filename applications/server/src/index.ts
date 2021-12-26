import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import proxy from 'express-http-proxy';
import { spawn } from 'child_process';

// const proxy = createProxyMiddleware('/stream', {
//   target: 'http://192.168.1.169:5004',
//   logLevel: "debug",
// });

// const proxy2 = createProxyMiddleware('/', {
//   target: 'localhost:9000/',
//   logLevel: "debug",
// });

const app = express();

app.get('/transcode', (req, res, next) => {
  // ffmpeg
  // -i 'udp://localhost:5000?fifo_size=1000000&overrun_nonfatal=1'
  // -crf 30
  // -preset ultrafast
  // -acodec aac
  // -ar 44100
  // -ac 2
  // -b:a 96k
  // -vcodec libx264
  // -r 25
  // -b:v 500k
  // -f flv
  // 'rtmp://<wowza server IP>/live/cam0'
  const args = [
    '-i', "http://192.168.1.169:5004/tuner0/v3.1",
    '-crf', '30',
    '-preset', 'ultrafast',
    '-acodec', 'aac',
    '-ar', '44100',
    '-ac', '2',
    '-b:a', '96k',
    '-vcodec', 'libx264',
    '-r', '25',
    '-b:v', '500k',
    '-f', 'flv',
    'pipe:1'
  ];
  const args2 = [
    '-c:v', 'libx264',
    '-x264opts', 'keyint=60:no-scenecut',
    // '-s',
    '-r', '30',
    '-b:v', '500k',
    '-profile:v', 'main',
    '-preset', 'veryfast',
    '-c:a', 'libfdk_aac',
    // '-sws_flags',
    '-hls_list_size', '2',
    '-f', 'hls',
    'pipe:1'
  ];
  const args3 = [
    '-i', "http://192.168.1.169:5004/tuner0/v3.1",
    '-ss', '0',                 //starting time offset
    '-c:v', 'libvpx',           //video using vpx (webm) codec
    '-b:v', '1M',               //1Mb/s bitrate for the video
    '-cpu-used', '2',           //total # of cpus used
    '-threads', '4',            //number of threads shared between all cpu-used
    '-deadline', 'realtime',    //speeds up transcode time (necessary unless you want frames dropped)
    '-strict', '-2',            //ffmpeg complains about using vorbis, and wanted this param
    '-c:a', 'libvorbis',        //audio using the vorbis (ogg) codec
    "-f", "webm",               //filetype for the pipe
    'pipe:1'                    //send output to stdout
  ]
  try {
    const ffmpeg = spawn('/usr/local/bin/ffmpeg', args3);
    // const ffmpeg = spawn(`ffmpeg -i 'http://192.168.1.169:5004/tuner0/v3.1' -crf 30 -preset ultrafast -acodec aac -ar 44100 -ac 2 -b:a 96k -vcodec libx264 -r 25 -b:v 500k -f flv pipe:1`);
    ffmpeg.stdout.pipe(res);
    // detect if ffmpeg was not spawned correctly
    ffmpeg.stderr.setEncoding('utf8');
    ffmpeg.stderr.on('data', function(data) {
      if(/^execvp\(\)/.test(data)) {
        console.error('failed to start ffmpeg');
        res.status(500).json({ error: data });
      }
      console.log(data);
    });
    ffmpeg.on('close', (code, signal) => { console.error('process close', code, signal); res.status(500).end(); });
    ffmpeg.on('error', (err) => { console.error('process error', err); res.status(500).end(); });
    ffmpeg.on('disconnect', () => console.error('disconnect'));
    req.on('close', () => {
      ffmpeg.kill();
    });
    req.on('end', () => ffmpeg.kill());
    res.header('Content-Type', 'video/webm;codecs=vp8,opus');
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  } finally {
    // next();
  }
});

app.get('/health', (req, res, next) => {
  res.json({
    alive: true,
  });
});

// app.use('/stream', proxy('192.168.1.169:5004'));
app.use('/', proxy('localhost:9000'));
// app.use(express.static('./static'))

app.listen(80, () => {
  console.log(`Listening on port 80`);
});
