import { createLiblog, LiblogConfig } from '@kaotypr/liblog';
import type { MessageHandler, RailframeBaseOptions, RailframeMessage } from '../types';

export class RailframeBase {
  protected handlers: Map<string, Set<MessageHandler>>;
  protected targetOrigin: string;
  protected delimiter: string;
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
    this.delimiter = options.delimiter || ':';
  }

  protected matchNamespace(pattern: string, type: string): boolean {
    const patternParts = pattern.split(this.delimiter);
    const typeParts = type.split(this.delimiter);

    if (patternParts.length !== typeParts.length) return false;

    return patternParts.every((part, index) => part === '*' || part === typeParts[index]);
  }

  protected handleMessage(event: MessageEvent) {
    // Add origin check
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
      this.logger.warn(`Message from unauthorized origin: ${event.origin}`);
      return;
    }

    const message = event.data as RailframeMessage;
    if (!message || !message.type) return;

    // Find all matching handlers including wildcards
    for (const [pattern, handlers] of this.handlers.entries()) {
      if (this.matchNamespace(pattern, message.type)) {
        handlers.forEach((handler) => handler(message.payload));
      }
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
