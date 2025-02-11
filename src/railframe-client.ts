import { RF_EMIT_PAYLOAD } from './constants/rf-emit-payload';
import { RF_EMIT_TYPE } from './constants/rf-emit-type';
import { RailframeBase } from './railframe-base';
import type { RailframeOptions } from './types';

export class RailframeClient extends RailframeBase {
  constructor(options?: RailframeOptions) {
    super({ ...options, scope: 'client' });
    window.addEventListener('message', this.handleMessage);

    this.emit(RF_EMIT_TYPE.READY, RF_EMIT_PAYLOAD.READY);
  }

  emit(type: string, payload?: any) {
    if (window.parent !== window) {
      window.parent.postMessage({ type, payload }, this.targetOrigin);
      // DEBUG
      this.logger.debug('emit', type);
      this.logger.debug('emit payload:', payload);
    }
  }

  destroy() {
    // DEBUG
    this.logger.debug('destroy client handlers');
    window.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
