import { RF_EMIT_PAYLOAD } from '../constants/rf-emit-payload'
import { RF_EMIT_TYPE } from '../constants/rf-emit-type'
import type { MessageHandler, RailframeOptions } from '../types'
import { RailframeBase } from './railframe-base'

/**
 * Container class
 * @class RailframeContainer
 * @extends RailframeBase
 */
export class RailframeContainer extends RailframeBase {
  private iframe: HTMLIFrameElement
  private ready = false
  private messageQueue: Array<{ type: string; payload: any }> = []

  /**
   * Create a new container
   * @param iframe - iframe element
   * @param options - container options
   * @param options.targetOrigin - target origin, can be a string or an array of strings. default is '*'
   * @param options.debug - debug mode, enable / disable debug mode. default is false
   * @param options.delimiter - delimiter, to recognize message type namespacing. default is ':'
   */
  constructor(iframe: HTMLIFrameElement, options?: RailframeOptions) {
    super({ ...options, scope: 'container' })
    this.iframe = iframe
    window.addEventListener('message', this.handleMessage)

    this.on(RF_EMIT_TYPE.READY, this.onIframeReady)
  }

  private onIframeReady: MessageHandler<typeof RF_EMIT_PAYLOAD.READY> = (payload) => {
    if (payload?.from === RF_EMIT_PAYLOAD.READY.from) {
      // Debug
      this.logger.debug('Iframe ready')
      this.ready = true
      this.processQueue()
    }
  }

  private processQueue() {
    // Debug
    this.logger.debug('Processing queue messages')
    this.messageQueue.forEach(({ type, payload }) => {
      this.emit(type, payload)
    })
    this.messageQueue = []
  }

  /**
   * Emit a message to the iframe
   * @param type - message type
   * @param payload - message payload
   */
  emit(type: string, payload?: any) {
    if (!this.ready && type !== 'ready') {
      // DEBUG
      this.logger.debug('Iframe is not ready')
      if (!this.messageQueue.find((m) => m.type === type)) {
        this.messageQueue.push({ type, payload })
        // DEBUG
        this.logger.debug(`Message ${type} queued`)
      }
      return
    }

    if (this.iframe.contentWindow) {
      // Send to all allowed origins
      this.targetOrigins.forEach((origin) => {
        this.iframe.contentWindow?.postMessage({ type, payload }, origin)
      })
      // Debug
      this.logger.debug('emit', type)
      this.logger.debug('emit payload:', payload)
    }
  }

  /**
   * Remove container message event listener and clear all handlers
   */
  destroy() {
    // Debug
    this.logger.debug('remove message listener in container')
    window.removeEventListener('message', this.handleMessage)
    // Debug
    this.logger.debug('clear all handlers in container')
    this.handlers.clear()
  }
}
