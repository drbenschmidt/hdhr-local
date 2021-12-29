export type TunerName = 'auto' | 'tuner0' | 'tuner1' | 'tuner2' | 'tuner3';

export interface TranscoderMetadata {
  hdhrAddress: string;
  tuner: TunerName;
  channel: string;
  outputType: 'webm' | 'hls';
}
