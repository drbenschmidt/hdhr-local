rm -rf ./tmp
mkdir tmp
ffmpeg \
  -i http://192.168.1.169:5004/tuner0/v3.1 \
  -preset veryfast -g 25 -sc_threshold 0 \
  -map v:0 -c:v:0 libx264 -b:v:0 2M \
  -map v:0 -c:v:1 libx264 -b:v:1 1M \
  -map a:0 -map a:0 -c:a aac -b:a 128k -ac 2 \
  -f hls \
  -hls_time 5 \
  -segment_time 5 \
  -hls_list_size 5 \
  -hls_flags delete_segments \
  -master_pl_name main.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:1" \
  ./tmp/stream_%v.m3u8