import * as ws from 'ws';

export interface SocketMessage<T> {
  type: 'rpc' | 'rpcr';
  data: T;
}

export interface RpcRequest {
  id: number;
  func: string;
  args?: string[];
}

export interface RpcResponse {
  id: number;
  success: boolean;
  result?: unknown;
  error?: string;
  errorCode?: number;
}

export type RpcRequestHandler = (args?: string[]) => Promise<unknown>;

export class RpcHandler {
  private handlers: Map<string, RpcRequestHandler> = new Map();

  async handle(ws: ws, request: RpcRequest): Promise<void> {
    if (!this.handlers.has(request.func)) {
      console.log(`RpcHandler contains no handler for '${request.func}'`);
      return;
    }

    const response: RpcResponse = {
      id: request.id,
      success: true,
    };

    try { 
      const handler = this.handlers.get(request.func);
      response.result = await handler?.call(null, request.args);
    } catch (e: any) {
      response.success = false;
      response.error = e.message;
      console.error(e);
    } finally {
      const message: SocketMessage<RpcResponse> = {
        type: 'rpcr',
        data: response,
      };
      ws.send(JSON.stringify(message));
    }
  }

  register(name: string, handler: RpcRequestHandler): void {
    if (this.handlers.has(name)) {
      throw new Error(`Handler ${name} already registered.`);
    }

    this.handlers.set(name, handler);
  }
}

export default RpcHandler;
