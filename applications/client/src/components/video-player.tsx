import React, { memo, useEffect, useRef } from "react";
import videojs from 'video.js'
import 'videojs-mpegtsjs'
import "video.js/dist/video-js.css";
//@ts-ignore
videojs.log.level('all');

import mpegtsjs from 'mpegts.js';

mpegtsjs.LoggingControl.enableDebug = true;

const useWindowUnloadEffect = (handler, callOnCleanup) => {
  const cb = useRef()
  
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

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const videoOptions = {
        ...options,
        mpegtsjs: {
          mediaDataSource: {
            isLive: true,
            cors: true,
            withCredentials: false,
            hasAudio: true,
            hasVideo: true,
          },
          config: {
            enableWorker: true,
          }
        },
      };

      const player = playerRef.current = videojs(videoElement, videoOptions, () => {
        console.log("player is ready");
        onReady && onReady(player);
      });
    } else {
      // you can update player here [update player through props]
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useWindowUnloadEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.dispose();
      playerRef.current = null;
    }
  }, true)

  return (
    <div data-vjs-player>
      <video preload="metadata" controls ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}

export default memo(VideoJS);