import {it,expect,vi} from 'vitest';
import {Game,type GameView} from './Game';
const deferred=()=>{let resolve!:()=>void;const promise=new Promise<void>(r=>resolve=r);return {promise,resolve};};
it('blocks reentry during sliding/eating, ignores no-op, then wins once for the whole state',async()=>{
 let animation=deferred(),celebration=deferred();
 const view:GameView={load:vi.fn(),sync:vi.fn(),animate:vi.fn(()=>animation.promise),celebrate:vi.fn(()=>celebration.promise)};
 const game=new Game(view,()=>{});
 await game.move('left');expect(game.state.moves).toBe(0);
 const first=game.move('up');expect(game.state.phase).toBe('moving');
 await game.move('right');game.undo();game.reset();expect(game.state.moves).toBe(1);expect(view.animate).toHaveBeenCalledTimes(1);
 animation.resolve();await first;expect(game.state.phase).toBe('ready');expect(view.celebrate).not.toHaveBeenCalled();
 animation=deferred();const winning=game.move('right');animation.resolve();await Promise.resolve();
 expect(game.state.phase).toBe('eating');await game.move('down');expect(game.state.moves).toBe(2);
 celebration.resolve();await winning;expect(game.state.phase).toBe('won');expect(view.celebrate).toHaveBeenCalledTimes(1);
 await game.move('down');expect(game.state.moves).toBe(2);
 game.undo();expect(game.state.moves).toBe(1);expect(game.state.phase).toBe('ready');expect(game.state.animals[0].position).toEqual({x:0,y:0});
 game.reset();expect(game.state.moves).toBe(0);expect(game.state.animals[0].position).toEqual({x:0,y:3});
});
it('disposal invalidates pending animations',async()=>{
 const animation=deferred();const view:GameView={load:vi.fn(),sync:vi.fn(),animate:()=>animation.promise,celebrate:vi.fn(async()=>{})};
 const game=new Game(view,()=>{});const moving=game.move('up');game.dispose();animation.resolve();await moving;expect(game.state.phase).toBe('disposed');expect(view.celebrate).not.toHaveBeenCalled();
});
