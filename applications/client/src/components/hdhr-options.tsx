import React, { memo, useCallback, useEffect, useState, useRef } from "react";

// status.json
// {
//   Resource: "tuner0",
//   VctNumber: "3.1",
//   VctName: "WISC",
//   Frequency: 201000000,
//   SignalStrengthPercent: 77,
//   SignalQualityPercent: 79,
//   SymbolQualityPercent: 100,
//   TargetIP: "192.168.1.116",
//   NetworkRate: 0
// }

// lineup.json
// {
//   GuideNumber: "3.1",
//   GuideName: "WISC",
//   VideoCodec: "MPEG2",
//   AudioCodec: "AC3",
//   HD: 1,
//   URL: "http://192.168.1.169:5004/auto/v3.1"
// }

type GuideResponse = Array<{
  name: string;
  number: string;
}>;

export interface HdHrOptions {
  onOptionsChanged?: (options: { tuner?: string; channel?: string; }) => void;
}

const HdHrOptions = (options: HdHrOptions) => {
  const { onOptionsChanged } = options;
  const [guide, setGuide] = useState<GuideResponse>();
  const [channel, setChannel] = useState<string>();
  const [tuner, setTuner] = useState<string>();
  const channelRef = useRef<HTMLSelectElement>(null);
  const tunerRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const doFetch = async () => {
      const result = await fetch('http://192.168.1.116/guide');
      const guide = await result.json();
      setGuide(guide);
    };

    doFetch();
  }, []);

  const onChannelSelect = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(({ target }) => {
    setChannel(target.value);
    onOptionsChanged?.({
      tuner: tunerRef.current?.value,
      channel: channelRef.current?.value
    });
  }, [onOptionsChanged]);

  const onTunerSelect = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(({ target }) => {
    setTuner(target.value);
    onOptionsChanged?.({
      tuner: tunerRef.current?.value,
      channel: channelRef.current?.value
    });
  }, [onOptionsChanged]);

  if (!guide) {
    return null;
  }

  const channelOptions = guide.map((v) => {
    return <option key={v.number} value={v.number}>{v.number} - {v.name}</option>;
  })

  const tunerOptions = ['auto', 'tuner0', 'tuner1', 'tuner2', 'tuner3'].map((v) => {
    return <option key={v} value={v}>{v}</option>;
  });

  return (
    <div>
      <div>
        Tuner:
        <select value={tuner} ref={tunerRef} onChange={onTunerSelect}>
          <option key="select" value="">Select</option>
          {tunerOptions}
        </select>
      </div>
      <div>
        Channel:
        <select value={channel} ref={channelRef} onChange={onChannelSelect}>
          <option key="select" value="">Select</option>
          {channelOptions}
        </select>
      </div>
    </div>
  );
};

export default memo(HdHrOptions);
