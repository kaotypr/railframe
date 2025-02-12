import { RF_EMIT_PAYLOAD } from '../constants/rf-emit-payload'
import { RF_EMIT_TYPE } from '../constants/rf-emit-type'
import type { RailframeOptions } from '../types'
import { RailframeBase } from './railframe-base'

/**
 * Client class
 * @class RailframeClient
 * @extends RailframeBase
 */
export class RailframeClient extends RailframeBase {
  /**
   * Create a new client
   * @param options - client options
   * @param options.targetOrigin - target origin
   * @param options.debug - debug mode
   * @param options.delimiter - delimiter
   */
  constructor(options?: RailframeOptions) {
    super({ ...options, scope: 'client' })
    window.addEventListener('message', this.handleMessage)

    this.emit(RF_EMIT_TYPE.READY, RF_EMIT_PAYLOAD.READY)
  }

  /**
   * Emit a message to the parent window
   * @param type - message type
   * @param payload - message payload
   */
  emit(type: string, payload?: any) {
    if (window.parent !== window) {
      // Send to all allowed origins
      this.targetOrigins.forEach((origin) => {
        window.parent.postMessage({ type, payload }, origin)
      })
      // Debug
      this.logger.debug('emit', type)
      this.logger.debug('emit payload:', payload)
    }
  }

  /**
   * Destroy the client and remove all listeners
   */
  destroy() {
    // Debug
    this.logger.debug('destroy client handlers')
    window.removeEventListener('message', this.handleMessage)
    this.handlers.clear()
  }
}
