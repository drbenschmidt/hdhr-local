import { memo } from "react";

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

const HdHrOptions = () => {
  return (
    <div>
      Tuner: <select></select>
    </div>
  )
};

export default memo(HdHrOptions);
