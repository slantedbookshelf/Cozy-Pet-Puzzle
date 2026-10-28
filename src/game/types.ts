export type Species = 'cat' | 'dog' | 'rabbit';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Cell = Readonly<{ x: number; y: number }>;
export type Animal = Readonly<{ id: string; species: Species; position: Cell }>;
export type Target = Readonly<{ animalId: string; position: Cell; food: Cell }>;
export type Level = Readonly<{
  id: number; title: string; lesson: string; width: number; height: number;
  animals: readonly Animal[]; obstacles: readonly Cell[]; targets: readonly Target[];
  solution: readonly Direction[];
}>;
export type Move = Readonly<{ id: string; from: Cell; to: Cell }>;
export type MoveResult = Readonly<{ animals: readonly Animal[]; moves: readonly Move[]; changed: boolean }>;
export const directions: readonly Direction[] = ['up', 'right', 'down', 'left'];
export const vectors: Record<Direction, Cell> = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} };
export const cellKey = (p: Cell) => `${p.x},${p.y}`;
export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
