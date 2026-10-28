import * as T from 'three';
import {Pet} from '../characters/pet';
import type {Animal,Cell,Direction,Move,Target} from '../game/types';
import {vectors,sameCell} from '../game/types';
import {contactFactory} from './environment/surfaces';
export const smooth=(v:number)=>{const u=T.MathUtils.clamp(v,0,1);return u*u*u*(u*(u*6-15)+10);};
export const turn=(from:number,to:number,u:number)=>from+Math.atan2(Math.sin(to-from),Math.cos(to-from))*smooth(u);
/** All roots share this curve: a following animal can never overtake a leader. */
export function motionProgress(elapsed:number,duration:number){return smooth((elapsed-.12)/(duration-.26));}
export class AnimalRenderer {
 readonly group=new T.Group();
 private pets=new Map<string,Pet>();private cells=new Map<string,Cell>();private shadows=new Map<string,T.Mesh>();
 private motion:{moves:readonly Move[];elapsed:number;duration:number;yaw:number;starts:Map<string,number>;resolve:()=>void}|null=null;
 private eating:{elapsed:number;starts:Map<string,number>;resolve:()=>void}|null=null;
 private satisfied=false;
 constructor(animals:readonly Animal[],private point:(cell:Cell)=>T.Vector3,private targets:readonly Target[]=[]){
  const contact=contactFactory();animals.forEach((a,i)=>{const p=new Pet(a.species,a.id,[0,0,0],i*2);p.root.name=a.id;p.root.scale.setScalar(.62);this.pets.set(a.id,p);this.group.add(p.root);this.shadows.set(a.id,contact(this.group,0,.214,0,.80,.70));});this.sync(animals);
 }
 sync(animals:readonly Animal[]){this.cancel();this.satisfied=false;for(const a of animals){const p=this.pets.get(a.id)!;this.cells.set(a.id,a.position);p.root.position.copy(this.point(a.position));p.root.rotation.y=0;p.resetPose();}this.updateShadows();}
 animate(moves:readonly Move[],direction:Direction){
  this.satisfied=false;const d=vectors[direction];
  return new Promise<void>(resolve=>{this.motion={moves,elapsed:0,duration:.60+Math.max(0,...moves.map(m=>Math.abs(m.to.x-m.from.x)+Math.abs(m.to.y-m.from.y)))*.095,yaw:Math.atan2(d.x,d.y),starts:new Map([...this.pets].map(([id,p])=>[id,p.root.rotation.y])),resolve};});
 }
 celebrate(){return new Promise<void>(resolve=>{this.eating={elapsed:0,starts:new Map([...this.pets].map(([id,p])=>[id,p.root.rotation.y])),resolve};});}
 private foodYaw(id:string){const target=this.targets.find(t=>t.animalId===id);return target?Math.atan2(target.food.x-target.position.x,target.food.y-target.position.y):Math.PI;}
 private updateShadows(){for(const [id,p] of this.pets){const s=this.shadows.get(id)!;s.position.x=p.root.position.x;s.position.z=p.root.position.z;s.scale.setScalar(1-p.body.position.y*.55);}}
 update(t:number,dt:number,reduced:boolean){
  for(const [id,p] of this.pets){
   p.update(t,dt,reduced);
   if(!this.motion&&!this.eating){const target=this.targets.find(q=>q.animalId===id);if(target&&sameCell(target.position,this.cells.get(id)!)){p.root.rotation.y=turn(p.root.rotation.y,this.foodYaw(id),Math.min(1,dt*10));if(this.satisfied)p.happy(t,1,reduced);else p.expectFood(t,reduced);}}
  }
  if(this.motion){const m=this.motion;m.elapsed+=dt;const total=reduced?.12:m.duration,progress=reduced?smooth(m.elapsed/total):motionProgress(m.elapsed,total);
   for(const move of m.moves){const p=this.pets.get(move.id)!;p.root.position.lerpVectors(this.point(move.from),this.point(move.to),progress);
    if(!sameCell(move.from,move.to)){p.root.rotation.y=turn(m.starts.get(move.id)!,m.yaw,m.elapsed/(reduced?.10:.22));if(!reduced){const weight=Math.sin(Math.PI*progress);const crouch=m.elapsed<.12?Math.sin(Math.PI*m.elapsed/.12):0;const settle=m.elapsed>total-.14?Math.sin(Math.PI*(m.elapsed-total+.14)/.14):0;p.run(m.elapsed,weight,crouch,settle);}}
   }
   if(m.elapsed>=total){for(const move of m.moves){this.pets.get(move.id)!.root.position.copy(this.point(move.to));this.cells.set(move.id,move.to);}this.motion=null;m.resolve();}
  }
  if(this.eating){const e=this.eating;e.elapsed+=dt;
   // Turning, communal meal and satisfaction all finish before Game displays its dialog.
   for(const [id,p] of this.pets){p.root.rotation.y=turn(e.starts.get(id)!,this.foodYaw(id),e.elapsed/.32);
    if(e.elapsed>.32&&e.elapsed<1.70)p.eat(e.elapsed-.32,smooth((e.elapsed-.32)/.18)*(1-smooth((e.elapsed-1.52)/.18)),reduced);
    if(e.elapsed>=1.70)p.happy(e.elapsed-1.70,smooth((e.elapsed-1.70)/.18),reduced);
   }
   if(e.elapsed>=2.65){this.eating=null;this.satisfied=true;e.resolve();}
  }
  this.updateShadows();
 }
 cancel(){const m=this.motion,e=this.eating;this.motion=null;this.eating=null;m?.resolve();e?.resolve();}
}
