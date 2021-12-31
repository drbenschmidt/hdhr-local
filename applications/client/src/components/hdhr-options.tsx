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

const HdHrOptions = () => {
  const [guide, setGuide] = useState<GuideResponse>();
  const channelRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const doFetch = async () => {
      const result = await fetch('http://192.168.1.116/guide');
      const guide = await result.json();
      setGuide(guide);
    };

    doFetch();
  }, []);

  const onChannelSelect = useCallback((...args) => {
    console.log(args);
  }, []);

  if (!guide) {
    return null;
  }

  const options = guide.map((v) => {
    return <option key={v.number} id={v.number} value={v.number}>{v.number} - {v.name}</option>
  })

  return (
    <div>
      <div>
        Tuner: <select></select>
      </div>
      <div>
        Channel: <select ref={channelRef} onChange={onChannelSelect}>{options}</select>
      </div>
    </div>
  )
};

export default memo(HdHrOptions);
