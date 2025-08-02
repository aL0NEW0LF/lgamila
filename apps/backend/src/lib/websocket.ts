import type { ClientToServer, ServerToClient } from '@lgamila/shared';
import { randomUUIDv7, type ServerWebSocket } from 'bun';
import { PING_INTERVAL, PING_TIMEOUT } from '@/constants';
import type { WebsocketData } from '../types/ws';
import { logger } from './logger';

export class WebSocketManager {
  private clients = new Map<
    string,
    {
      ws: ServerWebSocket<WebsocketData>;
      lastPing: number;
    }
  >();

  private healthCheckInterval: NodeJS.Timeout | null = null;

  static #instance: WebSocketManager | null = null;

  static get instance() {
    if (!this.#instance) {
      this.#instance = new WebSocketManager();
    }
    return this.#instance;
  }

  private constructor() {
    this.healthCheckInterval = setInterval(() => {
      this.checkAlive();
      this.clearDeadClients();
    }, PING_INTERVAL);
  }

  addClient(ws: ServerWebSocket<WebsocketData>) {
    if (this.clients.has(ws.data.id)) {
      logger.warn(`Client already exists: ${ws.data.id}`);
      return;
    }

    const id = randomUUIDv7();
    this.clients.set(id, {
      ws,
      lastPing: Date.now(),
    });
    logger.info(`Client added: ${id}`);
    return id;
  }

  async onMessage(id: string, message: ClientToServer) {
    const client = this.clients.get(id);
    if (!client) {
      logger.warn(`Client not found: ${id}`);
      return;
    }

    switch (message.type) {
      case 'pong':
        logger.debug(`Client ${id} is alive`);
        client.lastPing = Date.now();
        break;
      default:
        logger.warn(`Unknown message type: ${message.type}`);
        break;
    }
  }

  broadcastMessage(message: ServerToClient) {
    for (const client of this.clients.values()) {
      client.ws.send(JSON.stringify(message));
    }
  }

  sendMessage(id: string, message: ServerToClient) {
    const client = this.clients.get(id);
    if (!client) {
      logger.error(`Client not found: ${id}`);
      return;
    }

    client.ws.send(JSON.stringify(message));
  }

  removeClient(id: string) {
    logger.info(`Removing client ${id}`);
    this.clients.delete(id);
  }

  checkAlive() {
    for (const [id, _] of this.clients.entries()) {
      logger.debug(`Checking client ${id} alive`);
      this.sendMessage(id, {
        type: 'ping',
        data: {
          id,
        },
      });
    }
  }

  clearDeadClients() {
    const now = Date.now();
    for (const [id, client] of this.clients.entries()) {
      if (now - client.lastPing > PING_TIMEOUT) {
        this.removeClient(id);
      }
    }
  }

  close() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}
