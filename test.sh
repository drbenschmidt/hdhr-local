rm -rf ./tmp
mkdir tmp
ffmpeg \
  -i http://192.168.1.169:5004/tuner0/v3.1 \
  -c:v libx264 \
  -crf 31 \
  -preset veryfast \
  -b:v 1M \
  -c:a aac \
  -b:a 128k \
  -ac 2 \
  -r 25 \
  -sc_threshold 0 \
  -f hls \
  -hls_time 5 \
  -segment_time 5 \
  -hls_list_size 5 \
  -hls_flags delete_segments \
  ./tmp/stream.m3u8