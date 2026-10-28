import { Board } from './Board';
import { levels } from './levels';
export class LevelManager {
  readonly count = levels.length;
  get(index: number) {
    const level = levels[index];
    if (!level) throw new Error(`Unknown level: ${index}`);
    Board.fromLevel(level);
    return level;
  }
}
