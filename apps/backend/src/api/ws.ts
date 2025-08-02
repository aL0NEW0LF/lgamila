import { clientToServer } from '@lgamila/shared';
import type { ServerWebSocket } from 'bun';
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import { WebSocketManager } from '@/lib/websocket';
import { logger } from '../lib/logger';
import type { WebsocketData } from '../types/ws';

const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket<WebsocketData>>();
const manager = WebSocketManager.instance;

const wsRoute = new Hono().get(
  '/',
  upgradeWebSocket(() => {
    return {
      onOpen(_event, ws) {
        if (!ws.raw) {
          logger.error('WebSocket is missing');
          return;
        }

        const id = manager.addClient(ws.raw);
        if (!id) {
          logger.error('Failed to add client');
          return;
        }

        manager.sendMessage(id, {
          type: 'connected',
          data: {
            id,
          },
        });
      },
      onMessage(event) {
        const raw = event.data as string;
        const parsed = clientToServer.safeParse(JSON.parse(raw));


        if (!parsed.success) {
          logger.withError(parsed.error).error('Invalid message');
          return;
        }

        manager.onMessage(parsed.data.id, parsed.data);
      },
      onClose: (_event, _ws) => {
        // TODO: Remove client from manager
        logger.info('Connection closed');
      },
    };
  })
);

export { websocket };
export default wsRoute;
