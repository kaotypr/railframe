import { RF_EMIT_PAYLOAD } from '../constants/rf-emit-payload'
import { RF_EMIT_TYPE } from '../constants/rf-emit-type'
import { RailframeBase } from './railframe-base'
import type { MessageHandler, RailframeOptions } from '../types'

export class RailframeContainer extends RailframeBase {
  private iframe: HTMLIFrameElement
  private ready = false
  private messageQueue: Array<{ type: string; payload: any }> = []

  constructor(iframe: HTMLIFrameElement, options?: RailframeOptions) {
    super({ ...options, scope: 'container' })
    this.iframe = iframe
    window.addEventListener('message', this.handleMessage)

    this.on(RF_EMIT_TYPE.READY, this.onIframeReady)
  }

  private onIframeReady: MessageHandler<typeof RF_EMIT_PAYLOAD.READY> = (payload) => {
    if (payload?.from === RF_EMIT_PAYLOAD.READY.from) {
      this.ready = true
      // DEBUG
      this.logger.debug('Iframe ready')
      this.processQueue()
    }
  }

  private processQueue() {
    this.messageQueue.forEach(({ type, payload }) => {
      this.emit(type, payload)
    })
    this.messageQueue = []
  }

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
      this.iframe.contentWindow.postMessage({ type, payload }, this.targetOrigin)
      // DEBUG
      this.logger.debug('emit', type)
      this.logger.debug('emit payload:', payload)
    }
  }

  destroy() {
    // DEBUG
    this.logger.debug('destroy container handlers')
    window.removeEventListener('message', this.handleMessage)
    this.handlers.clear()
  }
}
