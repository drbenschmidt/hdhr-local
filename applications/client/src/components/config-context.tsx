import React, { createContext, useContext } from 'react';

export interface Config {
  apiBase: string;
  webSocketAddress: string;
}

const defaultConfig: Config = {
  apiBase: 'http://192.168.1.116',
  webSocketAddress: 'ws://192.168.1.116/socket'
};

const context = createContext<Config>(defaultConfig);

export const useConfig = () => {
  return useContext(context);
};

export const ConfigProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;

  // TODO: Get config from served html file. And maybe an API endpoint?
  const resolvedConfig = {
    ...defaultConfig,
  };

  return (
    <context.Provider value={resolvedConfig}>
      {children}
    </context.Provider>
  );
};
