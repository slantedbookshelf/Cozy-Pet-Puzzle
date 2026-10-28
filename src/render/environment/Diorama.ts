import * as T from 'three';
import type {Level} from '../../game/types';
import {buildBoardScene,tileSize} from '../boardScene';
import {buildRooms} from './rooms';
import {buildStreet} from './street';
import {batchStatic} from './batch';
import {buildNeighbourhood} from './neighbourhood';

export function buildDiorama(level:Level){
 const root=new T.Group();root.name='Cozy neighbourhood';
 const w=level.width*tileSize,h=level.height*tileSize;
 const street=buildStreet(w,h);
 const neighbourhood=buildNeighbourhood(w,h);
 root.add(neighbourhood.group,street.group,buildRooms(w,h),buildBoardScene(level));
 batchStatic(root);
 return {root,update(t:number,reduced:boolean){street.update(t,reduced);neighbourhood.update(t,reduced);}};
}
