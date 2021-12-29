export const getWebmArgs = (input: string): string[] => {
  return [
    '-i', input,
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
};
