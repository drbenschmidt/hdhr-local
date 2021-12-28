import express from 'express';
import type { Response, Request } from 'express';
import proxy from 'express-http-proxy';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import morgan from 'morgan';
import { getEncoders } from '@drbenschmidt/ffmpeg-utils';

const app = express();

const args = [
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
];

class TranscoderProcess {
  readonly channel: string;
  readonly handle: ChildProcessWithoutNullStreams;
  private streamerCount: number = 0;

  constructor(channel: string) {
    console.log(`Creating process for channel ${channel}`);
    this.channel = channel;
    this.handle = spawn('/usr/local/bin/ffmpeg', args);
  }

  removeStreamer() {
    this.streamerCount--;
    console.log(`Removing streamer for channel ${this.channel}, ${this.streamerCount} remain.`);

    if (this.streamerCount === 0) {
      console.log('No streamers left, killing transcode process');
      this.handle.kill('SIGKILL');
    }
  }

  addStreamer(request: Request, response: Response) {
    // Pipe the transcoded output into the response.
    this.handle.stdout.pipe(response);
    this.streamerCount++;

    request.on('close', () => {
      console.log('Request closed by client.');
      this.removeStreamer();
    });

    request.on('end', () => {
      console.log('Request ended unexpectedly.');
      this.removeStreamer();
    });

    /*
    fmpeg.on('close', (code, signal) => {
      console.error('process close', code, signal);
      res.status(500).end();
    });
    ffmpeg.on('error', (err) => {
      console.error('process error', err);
      res.status(500).end();
    });
    ffmpeg.on('disconnect', () => {
      console.error('disconnect');
      res.status(500).end();
    });
    */
  }
}

class Transcoder {
  private processes: TranscoderProcess[] = [];

  private getTranscoder(channel: string) {
    let process = this.processes.find(p => p.channel === channel);

    if (!process) {
      process = new TranscoderProcess(channel);
      this.processes.push(process);
    }

    return process;
  }

  addStreamer(channel: string, request: Request, response: Response) {
    const transcoder = this.getTranscoder(channel);

    transcoder.addStreamer(request, response);
  }
}

const service = new Transcoder();

app.use(morgan('dev'));

app.get('/transcode', (req, res) => {
  
  try {
    // Setup the response so the client knows what we're going to deliver.
    res.header('Content-Type', 'video/webm;codecs=vp8,opus');

    console.log('Adding streamer');
    service.addStreamer('v3.1', req, res);

    // Detect if ffmpeg was not spawned correctly
    // ffmpeg.stderr.setEncoding('utf8');
    // ffmpeg.stderr.on('data', function(data) {
    //   if(/^execvp\(\)/.test(data)) {
    //     console.error('failed to start ffmpeg');
    //     res.status(500).json({ error: data });
    //   }
    // });
    
  } catch (e) {
    console.error("transcode error", e);
    res.status(500).json({ error: e }).end();
  }
});

app.get('/health', (req, res, next) => {
  res.json({
    alive: true,
  });
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
