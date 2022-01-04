import express from 'express';
import RpcHandler, { RpcRequest, SocketMessage } from '../managers/rpc';

const router = express.Router();

const rpcHandler = new RpcHandler();

rpcHandler.register('debug.getTime', async () => {
  return new Date();
});

router.ws('/socket', (ws, req) => {
  ws.on('message', (buff) => {
    const data = buff.toString('utf-8');
    const message = JSON.parse(data) as SocketMessage<unknown>;

    switch (message.type) {
      case 'rpc':
        rpcHandler.handle(ws, message.data as RpcRequest);
        break;

      default:
        throw new Error(`[Socket] message type of ${message.type} unsupported`);
    }
  });
  console.log('socket', req.ip);
});

export default router;
