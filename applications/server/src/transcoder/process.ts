import { spawn } from 'child_process';
import fs from 'fs-extra';
import { getHlsArgs, getWebmArgs } from '@drbenschmidt/ffmpeg-utils';
import { TranscoderMetadata } from './metadata';
import type { Response, Request } from 'express';
import type { ChildProcessWithoutNullStreams } from 'child_process';

const buildInput = (meta: Pick<TranscoderMetadata, 'hdhrAddress' | 'tuner' | 'channel'>): string => {
  return `http://${meta.hdhrAddress}:5004/${meta.tuner}/v${meta.channel}`;
};

const buildOutput = (meta: TranscoderMetadata): string => {
  return `./temp/${meta.outputType}/${meta.hdhrAddress}/${meta.tuner}/${meta.channel}`
};

const buildArgs = (url: string, meta: TranscoderMetadata): string[] => {
  switch (meta.outputType) {
    case 'hls':
      return getHlsArgs(url, buildOutput(meta));

    case 'webm':
      return getWebmArgs(url);

    default:
      throw new Error(`TranscoderProcess: unsupported type ${meta.outputType}`);
  }
};

// TODO: Split this out into distinct logical objects.

export class TranscoderProcess {
  readonly meta: TranscoderMetadata;
  readonly inputUrl: string;
  readonly outputDir: string;
  private handle?: ChildProcessWithoutNullStreams;
  private streamerCount = 0;
  private args: string[] = [];
  ffmpegReady?: Promise<void>;

  constructor(meta: TranscoderMetadata) {
    this.meta = meta;
    this.inputUrl = buildInput(meta);
    this.outputDir = buildOutput(meta);
    this.args = buildArgs(this.inputUrl, meta);
  }

  private async cleanOutDir(): Promise<void> {
    console.log(`Ensuring a clean directory ${this.outputDir} exists`);
    await fs.emptyDir(this.outputDir);
  }

  async init() {
    await this.cleanOutDir();
    console.log(`Creating process for channel ${this.meta.channel} using ${this.meta.outputType}`);
    this.handle = spawn('/usr/local/bin/ffmpeg', this.args);
  }

  get isPiped(): boolean {
    return this.args[this.args.length - 1].startsWith('pipe');
  }

  removeStreamer() {
    this.streamerCount--;
    console.log(`Removing streamer for channel ${this.meta.channel}, ${this.streamerCount} remain.`);

    if (this.streamerCount === 0) {
      console.log('No streamers left, killing transcode process');
      this.handle?.kill('SIGKILL');
    }
  }

  addStreamer(request: Request, response: Response) {
    this.streamerCount++;

    // A piped transcode requires the request to stay open
    // and have the ffmpeg output piped into the response stream.
    // NOTE: I'm not sure this actually works for new streamers, I think without
    // specifying an I-Frame interval.
    if (this.isPiped) {
      // Pipe the transcoded output into the response.
      this.handle?.stdout.pipe(response);

      // TODO: Figure out how to search stdout for the right
      // response.
      this.ffmpegReady = new Promise((resolve, reject) => {
        setTimeout(() => resolve, 3000);
      });

      request.on('close', () => {
        console.log('Request closed by client.');
        this.removeStreamer();
      });
  
      request.on('end', () => {
        console.log('Request ended unexpectedly.');
        this.removeStreamer();
      });
    } else {
      if (this.ffmpegReady) {
        return;
      }

      // A non-piped transcode is going to have files created that
      // the client will pull. This is typically a manifest and chunks
      // at different resolutions and/or bit rates.
      this.ffmpegReady = new Promise((resolve, reject) => {
        const theWatcher = fs.watch(this.outputDir);
        const theHandler = (event: string, filename: string) => {
          // A rename event happens when a file is created or deleted,
          // and since this directory should be clean, we just wait for
          // the main manifest to be "renamed".
          if (event === 'rename' && filename === 'main.m3u8') {
            resolve();
            clearTimeout(idleTimeoutId);
            theWatcher.off('change', theHandler);
            theWatcher.close();
          } else {
            console.log('[THE WATCHER]', { event, filename });
          }
        };
        theWatcher.on('change', theHandler);
        // TODO: Just check for the file to exist, don't rely on output.
        /*const onReadyFinder = (buf: Buffer) => {
          const data = buf.toString('utf-8');
          if (data.includes('main.m3u8\' for writing')) {
            this.handle?.stderr.off('data', onReadyFinder);
            resolve();
          } else {
            console.log(data);
          }
        }
        this.handle?.stderr.on('data', onReadyFinder);
        */
        console.log(`Waiting for ffmpeg to write manifest.`);
        const idleTimeoutId = setTimeout(() => {
          console.log(`Ffmpeg did not write manifest within timeout, aborting.`);
          // this.handle?.stderr.off('data', onReadyFinder);
          theWatcher.off('change', theHandler);
          theWatcher.close();
          // TODO: Kill process?
          reject();
        }, 25000);
      });
    }

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
