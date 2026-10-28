import { sameCell, type Animal, type Target } from './types';
export function isWin(animals: readonly Animal[], targets: readonly Target[]) {
  return animals.length > 0 && animals.length === targets.length && new Set(targets.map(t=>t.animalId)).size === animals.length && animals.every(a => targets.some(t => t.animalId === a.id && sameCell(a.position,t.position)));
}
