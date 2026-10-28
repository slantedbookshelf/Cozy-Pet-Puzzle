import {describe,it,expect} from 'vitest';
import {Board} from './Board';
import {slide} from './MovementEngine';
import {isWin} from './WinChecker';
import {solve} from './solver';
import {levels} from './levels';
import {directions, vectors, sameCell, type Animal, type Direction} from './types';
const pet=(id:string,x:number,y:number):Animal=>({id,species:id==='dog'?'dog':id==='rabbit'?'rabbit':'cat',position:{x,y}});
describe('synchronous slide',()=>{
 it.each<[Direction,number,number]>([['up',2,0],['right',4,2],['down',2,4],['left',0,2]])('%s stops at boundary',(d,x,y)=>{
   expect(slide(new Board(5,5,[]),[pet('cat',2,2)],d).animals[0].position).toEqual({x,y});
 });
 it('stops before a fixed obstacle',()=>expect(slide(new Board(5,5,[{x:3,y:2}]),[pet('cat',0,2)],'right').animals[0].position).toEqual({x:2,y:2}));
 it.each(directions)('%s never crosses/merges animals and is independent of array order',d=>{
   const board=new Board(5,5,[]),animals=[pet('cat',1,1),pet('dog',2,1),pet('rabbit',1,2)];
   const a=slide(board,animals,d),b=slide(board,[...animals].reverse(),d);
   expect([...a.animals].sort((a,b)=>a.id.localeCompare(b.id))).toEqual([...b.animals].sort((a,b)=>a.id.localeCompare(b.id)));
   expect(new Set(a.animals.map(p=>JSON.stringify(p.position))).size).toBe(3);
   expect(a.animals).toHaveLength(3);
 });
 it('frontmost settles first; following animals stop behind it, travelling different distances',()=>{
   const animals=[pet('cat',0,0),pet('dog',2,0)];
   const next=slide(new Board(5,1,[]),animals,'right');
   expect(next.animals.map(a=>a.position.x)).toEqual([3,4]);
   expect(animals.map(a=>a.position.x)).toEqual([0,2]);
 });
 it('blocked input is a no-op',()=>expect(slide(new Board(2,1,[]),[pet('cat',0,0),pet('dog',1,0)],'right').changed).toBe(false));
 it('animals cannot enter the external food cell',()=>{
   const level=levels[0];const result=slide(Board.fromLevel(level),[pet('cat',3,2)],'up');
   expect(result.animals[0].position).toEqual({x:3,y:0});
 });
 it('invalid overlapping states are rejected',()=>expect(()=>slide(new Board(3,3,[]),[pet('cat',0,0),pet('dog',0,0)],'up')).toThrow());
 it('matches an independent simultaneous one-cell simulation for every 3-animal placement on a small obstacle board',()=>{
   const board=new Board(3,3,[{x:1,y:1}]);
   const cells=Array.from({length:9},(_,i)=>({x:i%3,y:Math.floor(i/3)})).filter(p=>board.isOpen(p));
   const reference=(initial:readonly Animal[],d:Direction)=>{
     let state=initial.map(a=>({...a,position:{...a.position}}));const v=vectors[d];
     for(let tick=0;tick<10;tick++){
       const destinations=state.map(a=>({x:a.position.x+v.x,y:a.position.y+v.y}));
       const moving=new Set(state.map((_,i)=>i).filter(i=>board.isOpen(destinations[i])));
       let changed=true;
       while(changed){changed=false;for(const i of moving){const occupant=state.findIndex(a=>sameCell(a.position,destinations[i]));if(occupant>=0&&!moving.has(occupant)){moving.delete(i);changed=true;}}}
       if(!moving.size)return state;
       state=state.map((a,i)=>({...a,position:moving.has(i)?destinations[i]:a.position}));
     }
     throw new Error('Reference failed to settle');
   };
   for(const a of cells)for(const b of cells)for(const c of cells){if(sameCell(a,b)||sameCell(a,c)||sameCell(b,c))continue;
     const animals=[pet('cat',a.x,a.y),pet('dog',b.x,b.y),pet('rabbit',c.x,c.y)];
     for(const d of directions)expect(slide(board,animals,d).animals).toEqual(reference(animals,d));
   }
 });
});
describe('simultaneous victory',()=>{
 const targets=[{animalId:'cat',position:{x:0,y:0},food:{x:0,y:-1}},{animalId:'dog',position:{x:3,y:0},food:{x:3,y:-1}}];
 it('one correct animal is insufficient and still moves away',()=>{
   const state=[pet('cat',0,0),pet('dog',2,2)];expect(isWin(state,targets)).toBe(false);
   expect(slide(new Board(4,4,[]),state,'down').animals[0].position).toEqual({x:0,y:3});
 });
 it('requires species-labelled targets, not just occupied cells',()=>expect(isWin([pet('dog',0,0),pet('cat',3,0)],targets)).toBe(false));
 it('wins only with all animals correct in the same state',()=>expect(isWin([pet('cat',0,0),pet('dog',3,0)],targets)).toBe(true));
 it('empty board does not win',()=>expect(isWin([],[])).toBe(false));
});
describe('teaching levels',()=>{
 it.each(levels)('level $id is BFS solvable and its saved path wins',level=>{
   const path=solve(level);expect(path).not.toBeNull();expect(level.solution).toHaveLength(path!.length);
   let state=level.animals;for(const d of level.solution) state=slide(Board.fromLevel(level),state,d).animals;
   expect(isWin(state,level.targets)).toBe(true);
 });
});
