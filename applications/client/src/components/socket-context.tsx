import React, { createContext, useContext } from 'react';
import { useConfig, Config } from './config-context';

interface SocketMessage<T> {
  type: 'rpc' | 'rpcr';
  data: T;
}

interface RpcRequest {
  id: number;
  func: string;
  args?: string[];
}

interface RpcResponse {
  id: number;
  success: boolean;
  result?: unknown;
  error?: string;
  errorCode?: number;
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
  private callbackQueue: Map<number, RpcCallback> = new Map<number, RpcCallback>();
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
    const obj = JSON.parse(event.data) as SocketMessage<unknown>;
    console.log('[onMessage]', event);

    switch (obj.type) {
      case 'rpcr':
        const response = obj.data as RpcResponse;
        const entry = this.callbackQueue.get(response.id);

        if (!entry) {
          return;
        }

        try {
          entry.callback.call(null, response.result);
        } catch (e) {
          console.error('[SocketContext] onMessage Error', e);
        } finally {
          this.callbackQueue.delete(response.id);
        }
      break;
    }
  };

  send<T>(message: SocketMessage<T>): void {
    this.ws?.send(JSON.stringify(message));
  }

  async rpc<TResponse>(message: Omit<RpcRequest, 'id'>): Promise<TResponse> {
    const deferred = new Deferred<TResponse>();
    // TODO: Add a timeout race.
    // TODO: Validate the request.
    const id = ++this.callbackId;
    this.callbackQueue.set(id, {
      callback: deferred.resolve,
      id,
    })
    this.send<RpcRequest>({
      type: 'rpc',
      data: {
        ...message,
        id,
      }
    });
    
    return deferred.promise;
  }

  async getTime(): Promise<Date> {
    const time = await this.rpc<Date>({ func: 'debug.getTime' });

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
