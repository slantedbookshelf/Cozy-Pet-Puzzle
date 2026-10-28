import {describe,it,expect,vi,afterAll} from 'vitest';
import * as T from 'three';
import {levels} from '../../game/levels';
import {buildBoardScene,boardPoint,tileSize} from '../boardScene';
import {buildRooms} from './rooms';
import {buildStreet} from './street';
import {buildNeighbourhood} from './neighbourhood';
import {batchStatic} from './batch';
import {Resources} from '../../core/resources';

// Texture drawing is irrelevant to geometric clearance; no browser/WebGL is required.
vi.stubGlobal('document',{createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){},createRadialGradient:()=>({addColorStop(){}})})})});
afterAll(()=>vi.unstubAllGlobals());
describe('diorama preserves playable space',()=>{
 it.each(levels)('level $id: raised decoration never enters a traversable animal footprint',level=>{
  const root=new T.Group();const w=level.width*tileSize,h=level.height*tileSize;
  root.add(buildBoardScene(level),buildRooms(w,h),buildStreet(w,h).group,buildNeighbourhood(w,h).group);root.updateMatrixWorld(true);
  const raised:{bounds:T.Box3;name:string}[]=[];
  root.traverse(o=>{if(o instanceof T.Mesh){o.geometry.computeBoundingBox();const bounds=o.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld);if(bounds.max.y>.25)raised.push({bounds,name:o.geometry.type});}});
  for(let y=0;y<level.height;y++)for(let x=0;x<level.width;x++){
    if(level.obstacles.some(p=>p.x===x&&p.y===y))continue;
    const p=boardPoint(level,{x,y});const animal=new T.Box3(new T.Vector3(p.x-.36,.25,p.z-.36),new T.Vector3(p.x+.36,1.28,p.z+.36));
    expect(raised.filter(o=>o.bounds.intersectsBox(animal)).map(o=>`${o.name} ${o.bounds.min.toArray()} ${o.bounds.max.toArray()}`),`free cell ${x},${y}`).toEqual([]);
  }
  new Resources().dispose(root);
 });
 it('batching preserves the scene extent and leaves animated crowns intact',()=>{
  const root=buildStreet(5*tileSize,5*tileSize).group;const before=new T.Box3().setFromObject(root);let animated=0;root.traverse(o=>{if(o.userData.dynamic)animated++;});
  batchStatic(root);const after=new T.Box3().setFromObject(root);let remaining=0;root.traverse(o=>{if(o.userData.dynamic)remaining++;});
  expect(before.min.distanceTo(after.min)).toBeLessThan(.001);expect(before.max.distanceTo(after.max)).toBeLessThan(.001);expect(remaining).toBe(animated);
  new Resources().dispose(root);
 });
});
