import { Board } from './Board';
import { slide } from './MovementEngine';
import { isWin } from './WinChecker';
import { directions, cellKey, type Animal, type Direction, type Level } from './types';
const stateKey = (animals: readonly Animal[]) => [...animals].sort((a,b)=>a.id.localeCompare(b.id)).map(a=>`${a.id}:${cellKey(a.position)}`).join('|');
/** Exhaustive BFS over labelled animal positions. No random spawning or merging. */
export function solve(level: Level): Direction[] | null {
  const board = Board.fromLevel(level);
  const queue: {animals: readonly Animal[]; path: Direction[]}[] = [{animals:level.animals,path:[]}];
  const seen = new Set([stateKey(level.animals)]);
  for (let i=0;i<queue.length;i++) {
    const state = queue[i];
    if (isWin(state.animals,level.targets)) return state.path;
    for (const d of directions) {
      const next = slide(board,state.animals,d); const key = stateKey(next.animals);
      if (!next.changed || seen.has(key)) continue;
      seen.add(key);queue.push({animals:next.animals,path:[...state.path,d]});
    }
  }
  return null;
}
