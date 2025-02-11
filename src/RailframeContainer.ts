import { RailframeBase } from './RailframeBase';
import type { RailframeOptions } from './types';

export class RailframeContainer extends RailframeBase {
  private iframe: HTMLIFrameElement;

  constructor(iframe: HTMLIFrameElement, options?: RailframeOptions) {
    super(options);
    this.iframe = iframe;
    window.addEventListener('message', this.handleMessage);
  }

  emit(type: string, payload: any) {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({ type, payload }, this.targetOrigin);
    }
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.handlers.clear();
  }
}
