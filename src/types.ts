export type MessageHandler = (data: any) => void;

export interface RailframeMessage {
  type: string;
  payload: any;
}

export interface RailframeOptions {
  targetOrigin: string;
}
