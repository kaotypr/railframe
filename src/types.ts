export type MessageHandler<T = any> = (data: T) => void;

export interface RailframeMessage<T = any> {
  type: string;
  payload: T;
}

export type RailframeScope = 'Railframe:Client' | 'Railframe:Container';

export interface RailframeBaseOptions {
  targetOrigin?: string;
  scope: RailframeScope;
  debug?: boolean;
}

export interface RailframeOptions extends Omit<RailframeBaseOptions, 'scope'> {}
