import { RailframeBase } from './RailframeBase';
import type { RailframeOptions } from './types';

export class RailframeContainer extends RailframeBase {
  private iframe: HTMLIFrameElement;
  private ready = false;

  constructor(iframe: HTMLIFrameElement, options?: RailframeOptions) {
    super({ ...options, scope: 'Railframe:Container' });
    this.iframe = iframe;
    window.addEventListener('message', this.handleMessage);

    this.on('ready', () => {
      this.ready = true;
      this.logger.debug('Iframe ready');
    });
  }

  emit(type: string, payload: any) {
    if (!this.ready && type !== 'ready') {
      this.logger.debug('Iframe not ready, message queued');
      setTimeout(() => this.emit(type, payload), 100);
      return;
    }

    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({ type, payload }, this.targetOrigin);
      this.logger.debug('emit', type);
      this.logger.debug('emit payload:', payload);
    }
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
