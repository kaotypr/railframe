import { createLiblog, LiblogConfig } from '@kaotypr/liblog';
import { RailframeBase } from './RailframeBase';
import type { RailframeOptions } from './types';

export class RailframeClient extends RailframeBase {
  constructor(options?: RailframeOptions) {
    super({ ...options, scope: 'Railframe:Client' });
    window.addEventListener('message', this.handleMessage);
  }

  emit(type: string, payload: any) {
    if (window.parent !== window) {
      window.parent.postMessage({ type, payload }, this.targetOrigin);
      this.logger.debug('emit', type);
      this.logger.debug('emit payload:', payload);
    }
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
