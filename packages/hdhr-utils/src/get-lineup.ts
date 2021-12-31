import fetch from 'node-fetch';

export interface Lineup {
  GuideNumber: string;
  GuideName: string;
  VideoCodec: string;
  AudioCodec: string;
  HD: number;
  URL: string;
}

export const getLineup = async (hdhrAddr: string): Promise<Lineup[]> => {
  const response = await fetch(`http://${hdhrAddr}/lineup.json`);

  return (await response.json()) as Lineup[];
}