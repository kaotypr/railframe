import { createLiblog, LiblogConfig } from '@kaotypr/liblog';
import type { MessageHandler, RailframeBaseOptions, RailframeMessage } from './types';

export class RailframeBase {
  protected handlers: Map<string, Set<MessageHandler>>;
  protected targetOrigin: string;
  protected loggerConfig = new LiblogConfig<'Railframe:Client' | 'Railframe:Container'>({
    warning: true,
    error: true,
  });
  public readonly logger: ReturnType<typeof createLiblog>;

  constructor(options: RailframeBaseOptions) {
    this.handlers = new Map();
    this.targetOrigin = options.targetOrigin || '*';
    this.handleMessage = this.handleMessage.bind(this);
    this.logger = createLiblog(this.loggerConfig, { scope: options.scope });
    if (options?.debug) this.logger.config.set({ verbose: true });
  }

  protected handleMessage(event: MessageEvent) {
    // Add origin check
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
      this.logger.warn(`Message from unauthorized origin: ${event.origin}`);
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
    // DEBUG
    this.logger.debug(`on ${type} handler added`);
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      // DEBUG
      this.logger.debug(`on ${type} handler removed`);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
  }
}
