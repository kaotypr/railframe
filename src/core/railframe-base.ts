import { Logger } from '@kaotypr/ll'
import type { MessageHandler, RailframeBaseOptions, RailframeMessage } from '../types'

/**
 * Base class for Railframe client and container
 */
export class RailframeBase {
  protected handlers: Map<string, Set<MessageHandler>>
  protected targetOrigins: string[]
  protected delimiter: string
  public readonly logger: Logger

  constructor(options: RailframeBaseOptions) {
    this.handlers = new Map()
    this.targetOrigins = options.targetOrigin
      ? Array.isArray(options.targetOrigin)
        ? options.targetOrigin
        : [options.targetOrigin]
      : ['*']
    this.handleMessage = this.handleMessage.bind(this)
    this.logger = new Logger({ enabled: options.debug, prefix: `[${options.scope}]` })
    this.delimiter = options.delimiter || ':'
  }

  protected matchNamespace(pattern: string, type: string): boolean {
    const patternParts = pattern.split(this.delimiter)
    const typeParts = type.split(this.delimiter)

    if (patternParts.length !== typeParts.length) return false

    return patternParts.every((part, index) => part === '*' || part === typeParts[index])
  }

  protected handleMessage(event: MessageEvent) {
    // Target origins check
    if (!this.targetOrigins.includes('*') && !this.targetOrigins.includes(event.origin)) {
      this.logger.warn(`Message from unauthorized origin: ${event.origin}`)
      return
    }

    const message = event.data as RailframeMessage
    if (!message || !message.type) return

    // Find all matching handlers including wildcards
    for (const [pattern, handlers] of this.handlers.entries()) {
      if (this.matchNamespace(pattern, message.type)) {
        handlers.forEach((handler) => handler(message.payload))
      }
    }
  }

  /**
   * Listen for message
   * @param type message type
   * @param handler callback function to be called when the message type is emitted
   */
  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)?.add(handler)
    // Debug
    this.logger.debug(`on ${type} handler added`)
  }

  /**
   * Remove message listener
   * @param type message type
   * @param handler optional specific handler to be removed, if not provided, all handlers for the message type will be removed
   */
  off(type: string, handler?: MessageHandler) {
    const handlers = this.handlers.get(type)
    if (handlers) {
      if (handler) {
        // Remove specific handler
        handlers.delete(handler)
        // Debug
        this.logger.debug(`on ${type} specific handler removed`)
      } else {
        // Remove all handlers for this type
        this.handlers.delete(type)
        // Debug
        this.logger.debug(`on ${type} all handlers removed`)
      }
    }
  }
}
