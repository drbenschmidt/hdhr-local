import fetch from 'node-fetch';

export interface TunerStatus {
  Resource: string;
  VctNumber?: string;
  VctName?: string;
  Frequency?: number;
  SignalStrengthPercent?: number;
  SignalQualityPercent?: number;
  SymbolQualityPercent?: number;
  TargetIP?: string;
  NetworkRate?: number;
}

export const getStatus = async (hdhrAddr: string): Promise<TunerStatus[]> => {
  const response = await fetch(`http://${hdhrAddr}/status.json`);

  return (await response.json()) as TunerStatus[];
};
