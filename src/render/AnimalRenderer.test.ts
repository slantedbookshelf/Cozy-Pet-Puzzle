import {it,expect,vi,afterAll} from 'vitest';
import * as T from 'three';
import {AnimalRenderer,motionProgress,turn} from './AnimalRenderer';
import {Pet} from '../characters/pet';
import {Resources} from '../core/resources';
import type {Animal} from '../game/types';
vi.stubGlobal('document',{createElement:()=>({getContext:()=>({fillRect(){},createRadialGradient:()=>({addColorStop(){}})})})});
afterAll(()=>vi.unstubAllGlobals());
const point=(p:{x:number;y:number})=>new T.Vector3(p.x,.14,p.y);
const animals:Animal[]=[{id:'cat',species:'cat',position:{x:0,y:0}},{id:'dog',species:'dog',position:{x:2,y:0}}];
it.each([1/24,1/60,1/144])('animation lands exactly and never crosses a leader at dt=%s',async dt=>{
 const r=new AnimalRenderer(animals,point);const done=vi.fn();const pending=r.animate([{id:'cat',from:{x:0,y:0},to:{x:3,y:0}},{id:'dog',from:{x:2,y:0},to:{x:4,y:0}}],'right').then(done);
 for(let t=0;t<1.4;t+=dt){r.update(t,dt,false);expect(r.group.getObjectByName('dog')!.position.x-r.group.getObjectByName('cat')!.position.x).toBeGreaterThanOrEqual(1-1e-10);}
 await pending;expect(done).toHaveBeenCalledOnce();expect(r.group.getObjectByName('cat')!.position.toArray()).toEqual([3,.14,0]);new Resources().dispose(r.group);
});
it('anticipation does not displace roots and turning takes the shortest arc',()=>{expect(motionProgress(.1,.9)).toBe(0);expect(motionProgress(.9,.9)).toBe(1);expect(turn(Math.PI-.1,-Math.PI+.1,.5)).toBeCloseTo(Math.PI);});
it('a single matched animal sniffs without chewing, and can leave its target',async()=>{
 const r=new AnimalRenderer(animals,point,[{animalId:'cat',position:{x:0,y:0},food:{x:0,y:-1}}]);
 r.update(.2,.2,false);const p=r.group.getObjectByName('cat')!.userData.pet as Pet;expect(p.head.rotation.x).toBeGreaterThan(0);expect(p.jaw.position.y).toBe(0);
 const pending=r.animate([{id:'cat',from:{x:0,y:0},to:{x:0,y:3}},{id:'dog',from:{x:2,y:0},to:{x:2,y:3}}],'down');r.update(1,2,false);await pending;r.update(2,.02,false);expect(p.root.position.z).toBe(3);expect(p.head.rotation.x).toBe(0);new Resources().dispose(r.group);
});
it('communal celebration resolves only after turning, chewing and happiness',async()=>{
 const r=new AnimalRenderer(animals,point);const done=vi.fn();const pending=r.celebrate().then(done);
 r.update(.2,.2,false);const cat=r.group.getObjectByName('cat')!.userData.pet as Pet;expect(cat.jaw.position.y).toBe(0);
 r.update(.8,.6,false);expect(cat.jaw.position.y).toBeLessThan(0);await Promise.resolve();expect(done).not.toHaveBeenCalled();
 r.update(2.1,1.3,false);expect(cat.eyes[0].scale.y).toBeLessThan(.5);await Promise.resolve();expect(done).not.toHaveBeenCalled();
 r.update(3,.9,false);await pending;expect(done).toHaveBeenCalledOnce();new Resources().dispose(r.group);
});
it.each(['cat','dog','rabbit'] as const)('%s gait articulates limbs and reset restores a neutral pose',species=>{const p=new Pet(species,'test',[0,0,0],0);p.run(.2,1,.3,.1);expect(p.limbs.some(l=>Math.abs(l.rotation.x)>.1)).toBe(true);expect(p.ears.some(e=>Math.abs(e.rotation.x)>.01)).toBe(true);p.resetPose();expect(p.limbs.every(l=>l.rotation.x===0)).toBe(true);expect(p.body.position.y).toBe(0);new Resources().dispose(p.root);});
