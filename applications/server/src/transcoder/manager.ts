import { TranscoderProcess } from "./process";
import type { Response, Request } from 'express';
import type { TranscoderMetadata } from "./metadata";

export class TranscodeManager {
  private processes: TranscoderProcess[] = [];

  private async getTranscoder(meta: TranscoderMetadata) {
    let process = this.processes.find(p => p.meta.channel === meta.channel);

    if (!process) {
      process = new TranscoderProcess(meta);
      await process.init();
      this.processes.push(process);
    }

    return process;
  }

  async addStreamer(meta: TranscoderMetadata, request: Request, response: Response): Promise<void> {
    const transcoder = await this.getTranscoder(meta);

    transcoder.addStreamer(request, response);

    return transcoder.ffmpegReady;
  }
}