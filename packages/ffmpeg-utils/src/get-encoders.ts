import { spawnSync } from 'child_process';
import * as os from 'os';

const pattern = /([VASFSXBD\.]{6}) (\w*)*\s*(.*)$/gim;

/**
 * Output:
 * Encoders:
 V..... = Video
 A..... = Audio
 S..... = Subtitle
 .F.... = Frame-level multithreading
 ..S... = Slice-level multithreading
 ...X.. = Codec is experimental
 ....B. = Supports draw_horiz_band
 .....D = Supports direct rendering method 1
 ------
 V..... a64multi             Multicolor charset for Commodore 64 (codec a64_multi)
 */
export interface EncoderLineItemMeta {
  isVideo: boolean;
  isAudio: boolean;
  isSubtitle: boolean;
  frameLevelMultithreading: boolean;
  sliceLevelMultithreading: boolean;
  isExperimental: boolean;
  hasDrawHorizBandSupport: boolean;
  hasDirectReneringMethod1Support: boolean;
};

export interface EncoderLineItem {
  name: string;
  description: string;
  meta: EncoderLineItemMeta;
}

const buildMeta = (block: string): EncoderLineItemMeta => {
  return {
    isVideo: block[0] === 'V',
    isAudio: block[0] === 'A',
    isSubtitle: block[0] === 'S',
    frameLevelMultithreading: block[1] === 'F',
    sliceLevelMultithreading: block[2] === 'S',
    isExperimental: block[3] === 'X',
    hasDrawHorizBandSupport: block[4] === 'B',
    hasDirectReneringMethod1Support: block[5] === 'D',
  };
};

export const getEncoders = () => {
  const { stdout } = spawnSync('ffmpeg', ['-encoders']);
  const rawEncoderLines = stdout.toString('utf-8').split(os.EOL);

  // Remove header describing what is what.
  rawEncoderLines.splice(0, 10);
  //console.log(rawEncoderLines);
  const encoders = rawEncoderLines.map((line) => {
    const result = pattern.exec(line);
    if (!result) {
      return;
    }

    return {
      name: result[2],
      description: result[3],
      meta: buildMeta(result[1]),
    };
  }).filter(v => !!v);

  return encoders;
};
