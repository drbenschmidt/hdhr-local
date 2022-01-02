import React, { createContext, useContext } from 'react';
import { useConfig, Config } from './config-context';

interface RpcMessage {
  id?: number;
  func: string;
  args?: string[];
}

interface RpcCallback {
  id: number;
  callback: (value: any) => void;
}

class Deferred<T> {
  readonly promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.resolve = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.reject = () => {};

    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

class SocketContext {
  private readonly address: string;
  private ws?: WebSocket;
  private callbackQueue: RpcCallback[] = [];
  private callbackId = 0;

  constructor(config: Config) {
    this.address = config.webSocketAddress;
  }

  connect() {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(this.address);
      this.bind();
    }
  }

  private bind() {
    this.ws?.addEventListener('message', this.onMessage);
    this.ws?.addEventListener('open', () => console.log('[SocketContext] Connection Opened'));
    this.ws?.addEventListener('close', () => console.log('[SocketContext] Connection Closed'));
    this.ws?.addEventListener('error', (err) => console.log('[SocketContext] Connection Error', err));
  }

  private onMessage = (event: MessageEvent<any>) => {
    const obj = JSON.parse(event.data);
    console.log('[onMessage]', event);

    // TODO: Conform to an RPC interface.
    if (obj.callbackId) {
      const entry = this.callbackQueue.find((c) => c.id);

      if (entry) {
        entry.callback.call(null, obj.response)
      }
    }
  };

  send<T>(message: T): void {
    this.ws?.send(JSON.stringify(message));
  }

  async rpc<TResponse>(message: RpcMessage): Promise<TResponse> {
    const deferred = new Deferred<TResponse>();
    // TODO: Add a timeout race.
    // TODO: Validate the request.
    const id = ++this.callbackId;
    this.callbackQueue.push({
      callback: deferred.resolve,
      id,
    })
    this.send({
      ...message,
      id,
    });
    
    return deferred.promise;
  }

  async getTime(): Promise<Date> {
    const time = await this.rpc<Date>({ func: 'time' });

    return time;
  }
}

const context = createContext<SocketContext | null>(null);

export const useSocketConnection = (): SocketContext | null => {
  return useContext(context);
};

export const SocketProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const config = useConfig();
  const value = new SocketContext(config);

  value.connect();

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  )
};
