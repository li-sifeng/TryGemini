export interface Point {
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum GameState {
  IDLE,
  DRAGGING,
}