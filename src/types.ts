export type MessageHandler<T = any> = (data: T) => void;

export interface RailframeMessage<T = any> {
  type: string;
  payload: T;
}

export type RailframeScope = 'client' | 'container';

export interface RailframeBaseOptions {
  targetOrigin?: string;
  scope: RailframeScope;
  debug?: boolean;
}

export interface RailframeOptions extends Omit<RailframeBaseOptions, 'scope'> {}
