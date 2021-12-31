import { spawn } from 'child_process';
import type { Response, Request } from 'express';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import { TranscoderMetadata } from './metadata';
import { getHlsArgs, getWebmArgs } from '@drbenschmidt/ffmpeg-utils';

const buildInput = (meta: Pick<TranscoderMetadata, 'hdhrAddress' | 'tuner' | 'channel'>): string => {
  return `http://${meta.hdhrAddress}:5004/${meta.tuner}/${meta.channel}`;
};

const buildArgs = (url: string, meta: Pick<TranscoderMetadata, 'outputType' | 'tuner'>): string[] => {
  switch (meta.outputType) {
    case 'hls':
      return getHlsArgs(url, meta.tuner);

    case 'webm':
      return getWebmArgs(url);

    default:
      throw new Error(`TranscoderProcess: unsupported type ${meta.outputType}`);
  }
};

// TODO: Split this out into distinct logical objects.

export class TranscoderProcess {
  readonly meta: TranscoderMetadata;
  readonly url: string;
  private handle?: ChildProcessWithoutNullStreams;
  private streamerCount = 0;
  private args: string[] = [];
  ffmpegReady?: Promise<void>;

  constructor(meta: TranscoderMetadata) {
    this.meta = meta;
    this.url = buildInput(meta);
    this.args = buildArgs(this.url, meta);
  }

  async init() {
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
      // A non-piped transcode is going to have files created that
      // the client will pull. This is typically a manifest and chunks
      // at different resolutions and/or bit rates.
      this.ffmpegReady = new Promise((resolve, reject) => {
        const onReadyFinder = (data: string) => {
          if (data.includes('main.m3u8\' for writing')) {
            this.handle?.stdout.off('data', onReadyFinder);
            resolve();
          }
        }
        this.handle?.stdout.on('data', onReadyFinder);
        setTimeout(() => {
          this.handle?.stdout.off('data', onReadyFinder);
          reject();
        }, 10000);
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
