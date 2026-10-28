import {Board} from './Board';
import {LevelManager} from './LevelManager';
import {slide} from './MovementEngine';
import {isWin} from './WinChecker';
import type {Animal,Direction,Level,Move} from './types';
export type Phase = 'ready'|'moving'|'eating'|'won'|'disposed';
export interface GameView {
  load(level:Level, animals:readonly Animal[]):void;
  sync(animals:readonly Animal[]):void;
  animate(moves:readonly Move[],direction:Direction):Promise<void>;
  celebrate():Promise<void>;
}
export interface GameState {level:Level;index:number;total:number;animals:readonly Animal[];moves:number;phase:Phase;canUndo:boolean;}
export class Game {
  private manager=new LevelManager();
  private index=0;
  private level=this.manager.get(0);
  private board=Board.fromLevel(this.level);
  private animals=this.level.animals;
  private history: (readonly Animal[])[]=[];
  private phase:Phase='ready';
  private revision=0;
  constructor(private view:GameView,private changed:(state:GameState)=>void){this.load(0);}
  get state():GameState {return {level:this.level,index:this.index,total:this.manager.count,animals:this.animals,moves:this.history.length,phase:this.phase,canUndo:this.history.length>0&&(this.phase==='ready'||this.phase==='won')};}
  private emit(){this.changed(this.state);}
  private load(index:number){this.revision++;this.index=index;this.level=this.manager.get(index);this.board=Board.fromLevel(this.level);this.animals=this.level.animals;this.history=[];this.phase='ready';this.view.load(this.level,this.animals);this.emit();}
  async move(direction:Direction){
    if(this.phase!=='ready')return;
    const result=slide(this.board,this.animals,direction);
    if(!result.changed)return;
    const revision=this.revision;
    this.history.push(this.animals);this.animals=result.animals;this.phase='moving';this.emit();
    await this.view.animate(result.moves,direction);
    if(revision!==this.revision)return;
    if(isWin(this.animals,this.level.targets)){
      this.phase='eating';this.emit();await this.view.celebrate();
      if(revision!==this.revision)return;
      this.phase='won';
    }else this.phase='ready';
    this.emit();
  }
  undo(){if(!this.state.canUndo)return;this.revision++;this.animals=this.history.pop()!;this.phase='ready';this.view.sync(this.animals);this.emit();}
  reset(){if(this.phase==='moving'||this.phase==='eating'||this.phase==='disposed')return;this.load(this.index);}
  next(){if(this.phase==='won'&&this.index+1<this.manager.count)this.load(this.index+1);}
  replay(){if(this.phase==='won')this.load(0);}
  dispose(){this.revision++;this.phase='disposed';}
}
