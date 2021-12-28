import React, { useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import VideoPlayer from './components/video-player';

const App = () => {
  const playerRef = useRef(null);

  const videoJsOptions = { // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      //src: 'http://localhost/stream/tuner0/v3.1',
      //src: 'http://192.168.1.116/transcode',
      //type: 'video/webm;codecs=vp8,opus',
      src: 'http://192.168.1.116/hls/main.m3u8'
    }]
  };

  const handlePlayerReady = useCallback((player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });
  }, [playerRef.current]);

  return (
    <>
      <h1>My React and TypeScript App!</h1>
      <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
