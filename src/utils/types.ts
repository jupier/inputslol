export type Direction = "up" | "down" | "left" | "right";
export type SnakePiece = { x: number; y: number; direction: Direction };
export type Move = { x: number; y: number; direction: Direction };
export type Snake = SnakePiece[];
export type Food = { x: number; y: number };