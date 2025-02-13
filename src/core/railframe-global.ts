import type { RailframeOptions } from '../types'
import { RailframeBase } from './railframe-base'

/**
 * Global class that combines both client and container functionality
 * @class RailframeGlobal
 * @extends RailframeBase
 */
export class RailframeGlobal extends RailframeBase {
  /**
   * Create a new global instance
   * @param options - global options
   * @param options.targetOrigin - target origin, can be a string or an array of strings. default is '*'
   * @param options.debug - debug mode, enable / disable debug mode. default is false
   * @param options.delimiter - delimiter, to recognize message type namespacing. default is ':'
   */
  constructor(options?: RailframeOptions) {
    super({ ...options, scope: 'global' })
    window.addEventListener('message', this.handleMessage)
  }

  /**
   * Emit a message to the parent window
   * @param type - message type
   * @param payload - message payload
   */
  emitToContainer(type: string, payload?: any) {
    if (window.parent !== window) {
      // Send to all allowed origins
      this.targetOrigins.forEach((origin) => {
        window.parent.postMessage({ type, payload }, origin)
      })
      // Debug
      this.logger.debug('emit to container', type)
      this.logger.debug('emit payload:', payload)
    }
  }

  /**
   * Emit a message to specific iframe
   * @param iframe - target iframe element
   * @param type - message type
   * @param payload - message payload
   */
  emitToClient(iframe: HTMLIFrameElement, type: string, payload?: any) {
    if (!iframe) {
      this.logger.error(`emit "${type}" to client failed, target iframe not found`)
      return
    }
    if (iframe.contentWindow) {
      // Send to all allowed origins
      this.targetOrigins.forEach((origin) => {
        iframe.contentWindow?.postMessage({ type, payload }, origin)
      })
      // Debug
      this.logger.debug('emit to client', type)
      this.logger.debug('emit payload:', payload)
    }
  }

  /**
   * Remove global message event listener and clear all handlers
   */
  destroy() {
    // Debug
    this.logger.debug('remove message listener in global')
    window.removeEventListener('message', this.handleMessage)
    // Debug
    this.logger.debug('clear all handlers in global')
    this.handlers.clear()
  }
}
