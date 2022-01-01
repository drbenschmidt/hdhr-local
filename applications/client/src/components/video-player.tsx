import React, { memo, useEffect, useRef } from "react";
import videojs, { VideoJsPlayerOptions } from 'video.js'
import type { VideoJsPlayer } from 'video.js';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
import "video.js/dist/video-js.css";

videojs.log.level('all');

type BeforeUnloadHandler = (this: Window, ev: BeforeUnloadEvent) => void;

type VideoJsPlayerWithHls = VideoJsPlayer & {
  hlsQualitySelector: (options: Record<string, any>) => void;
}

const useWindowUnloadEffect = (handler: BeforeUnloadHandler, callOnCleanup: boolean) => {
  const cb = useRef<BeforeUnloadHandler>()
  
  cb.current = handler;
  
  useEffect(() => {
    const handler = () => cb.current;
  
    window.addEventListener('beforeunload', handler)
    
    return () => {
      if (callOnCleanup) {
        handler();
      }
    
      window.removeEventListener('beforeunload', handler)
    }
  }, [callOnCleanup])
};

export interface VideoPlayerProps {
  options: any;
  onReady: (player: VideoJsPlayerWithHls) => void;
  streamingOptions: StreamingOptions;
}

export type StreamingOptions = {
  tuner?: string;
  channel?: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoJsPlayerWithHls>();
  const { options, onReady, streamingOptions } = props;

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const videoOptions: VideoJsPlayerOptions = {
        ...options,
      };

      const player = playerRef.current = videojs(videoElement, videoOptions, () => {
        console.log("player is ready");
        onReady?.(player);
      }) as VideoJsPlayerWithHls;

      playerRef.current?.hlsQualitySelector({
        displayCurrentQuality: true,
      });
    } else {
      // you can update player here [update player through props]
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);

      if (streamingOptions.channel && streamingOptions.tuner) {
        fetch(`http://192.168.1.116/hls/192.168.1.169/${streamingOptions.tuner}/${streamingOptions.channel}`)
          .then(async (val) => {
            const resp = await val.json();
            playerRef.current?.src(resp.src);
          });
      }
    }
  }, [onReady, options, streamingOptions.channel, streamingOptions.tuner, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = undefined;
      }
    };
  }, [playerRef]);

  useWindowUnloadEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.dispose();
      playerRef.current = undefined;
    }
  }, true)

  return (
    <div data-vjs-player>
      <video preload="metadata" controls ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}

export default memo(VideoPlayer);