import { cellKey, type Cell, type Level, type Animal } from './types';
export class Board {
  private blocked: Set<string>;
  constructor(readonly width: number, readonly height: number, obstacles: readonly Cell[]) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error('Invalid board size');
    this.blocked = new Set(obstacles.map(cellKey));
    if (this.blocked.size !== obstacles.length || obstacles.some(p => !this.contains(p))) throw new Error('Invalid obstacles');
  }
  contains(p: Cell) { return Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < this.width && p.y < this.height; }
  isOpen(p: Cell) { return this.contains(p) && !this.blocked.has(cellKey(p)); }
  validateAnimals(animals: readonly Animal[]) {
    if (!animals.length || new Set(animals.map(a => a.id)).size !== animals.length || new Set(animals.map(a => cellKey(a.position))).size !== animals.length || animals.some(a => !this.isOpen(a.position))) throw new Error('Invalid animal positions or IDs');
  }
  static fromLevel(level: Level) {
    const board = new Board(level.width, level.height, level.obstacles);
    board.validateAnimals(level.animals);
    if (level.targets.length !== level.animals.length || new Set(level.targets.map(t => t.animalId)).size !== level.animals.length || new Set(level.targets.map(t => cellKey(t.position))).size !== level.targets.length) throw new Error('Invalid targets');
    for (const target of level.targets) {
      if (!level.animals.some(a => a.id === target.animalId) || !board.isOpen(target.position) || board.contains(target.food) || Math.abs(target.food.x-target.position.x)+Math.abs(target.food.y-target.position.y)!==1) throw new Error('Food must be outside and adjacent to its target');
    }
    return board;
  }
}
