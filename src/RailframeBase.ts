import type { MessageHandler, RailframeMessage, RailframeOptions } from './types';

export class RailframeBase {
  protected handlers: Map<string, Set<MessageHandler>>;
  protected targetOrigin: string;

  constructor(options: RailframeOptions = { targetOrigin: '*' }) {
    this.handlers = new Map();
    this.targetOrigin = options.targetOrigin;
    this.handleMessage = this.handleMessage.bind(this);
  }

  protected handleMessage(event: MessageEvent) {
    // Add origin check
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
      console.warn(`Message from unauthorized origin: ${event.origin}`);
      return;
    }

    const message = event.data as RailframeMessage;
    if (!message || !message.type) {
      return;
    }

    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.payload));
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)?.add(handler);
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
  }
}
