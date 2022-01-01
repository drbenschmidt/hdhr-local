import * as os from 'os';

let encoder = 'libx264';
const PREFER_HARDWARE_ENCODER = true; // TODO: toggle this?

if (PREFER_HARDWARE_ENCODER) {
  switch (os.platform()) {
    // macOS
    case 'darwin':
      encoder = 'h264_videotoolbox';
      break;
    case 'linux':
      encoder = 'libx264'; // idk what to make this yet.
      break;
  }
}

export const getHlsArgs = (input: string, outpath: string): string[] => {
  return [
    '-i', input,
    '-filter_complex', '[v:0]split=4[voutorig][vtemp001][vtemp002][vtemp003];[vtemp001]scale=w=1280:h=720[vout001];[vtemp002]scale=w=960:h=540[vout002];[vtemp003]scale=w=640:h=360[vout003]',                 //starting time offset
    '-preset', 'veryfast',
    '-g', '25',
    '-sc_threshold', '0',

    '-map', '[voutorig]',
    '-c:v:0', encoder,
    '-b:v:0', '2M',

    '-map', '[vout001]',
    '-c:v:1', encoder,
    '-b:v:1', '1M',

    '-map', '[vout002]',
    '-c:v:2', encoder,
    '-b:v:2', '500K',

    '-map', '[vout003]',
    '-c:v:3', encoder,
    '-b:v:3', '250K',

    '-map', 'a:0',
    '-map', 'a:0',
    '-map', 'a:0',
    '-map', 'a:0',

    '-c:a', 'aac',
    '-b:a', '128K',
    '-ac', '2',

    '-f', 'hls',
    '-hls_time', '5',
    '-segment_time', '5',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments',
    '-master_pl_name', 'main.m3u8',
    '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3',
    `${outpath}/stream_%v.m3u8`
  ];
};
