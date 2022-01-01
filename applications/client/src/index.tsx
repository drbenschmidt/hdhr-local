import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import VideoPlayer, { StreamingOptions } from './components/video-player';
import HdhrOptions from "./components/hdhr-options";

const App = () => {
  const [streamingOptions, setStreamingOptions] = useState<StreamingOptions>();
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
      //src: 'http://192.168.1.116/hls/main.m3u8'
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
  }, [playerRef]);

  const onOptionsChanged = useCallback((options) => {
    setStreamingOptions(options);
  }, []);

  const player = () => {
    if (!streamingOptions?.tuner || !streamingOptions?.channel) {
      return null;
    }

    return <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} streamingOptions={streamingOptions} />
  }

  return (
    <>
      <HdhrOptions onOptionsChanged={onOptionsChanged} />
      {player()}
    </>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
