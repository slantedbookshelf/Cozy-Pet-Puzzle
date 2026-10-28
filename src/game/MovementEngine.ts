import { Board } from './Board';
import { cellKey, sameCell, vectors, type Animal, type Direction, type MoveResult } from './types';
/** Pure, deterministic 2048-style slide. Frontmost animals settle first. */
export function slide(board: Board, animals: readonly Animal[], direction: Direction): MoveResult {
  board.validateAnimals(animals);
  const d = vectors[direction];
  const ordered = [...animals].sort((a,b) =>
    (b.position.x*d.x+b.position.y*d.y)-(a.position.x*d.x+a.position.y*d.y) || a.id.localeCompare(b.id));
  const occupied = new Set(animals.map(a => cellKey(a.position)));
  const final = new Map<string, Animal>();
  for (const animal of ordered) {
    occupied.delete(cellKey(animal.position));
    let position = {...animal.position};
    for (;;) {
      const next = {x:position.x+d.x,y:position.y+d.y};
      if (!board.isOpen(next) || occupied.has(cellKey(next))) break;
      position = next;
    }
    occupied.add(cellKey(position));
    final.set(animal.id,{...animal,position});
  }
  const result = animals.map(a => final.get(a.id)!);
  const moves = animals.map((a,i) => ({id:a.id,from:{...a.position},to:{...result[i].position}}));
  return {animals:result,moves,changed:moves.some(m => !sameCell(m.from,m.to))};
}
