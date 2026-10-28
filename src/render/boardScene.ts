import * as T from 'three';
import {box,cylinder,ellipsoid,mesh,label,tube,colors as C} from '../world/primitives';
import {bed,bone,book,jar,picture,placed,plant,rug,shelf,yarn} from './environment/props';
import {woodFloor,pawDecal,contactFactory} from './environment/surfaces';
import type {Cell,Level} from '../game/types';
export const tileSize=1.16;
// Coordinate mapping is unchanged: artwork never participates in the movement engine.
export function boardPoint(level:Level,cell:Cell){return new T.Vector3((cell.x-(level.width-1)/2)*tileSize,.14,(cell.y-(level.height-1)/2)*tileSize);}
const palette:Record<string,string>={cat:'#91b9ac',dog:'#ddb08b',rabbit:'#c5b3ce'};
export function buildBoardScene(level:Level){
 const g=new T.Group();g.name='Core pet shop';const w=level.width*tileSize,h=level.height*tileSize,back=-h/2-1.18;
 const contact=contactFactory();
 box(g,[w+1.35,.30,h+1.85],[0,-.07,-.5],'#d6ba94',.10);
 woodFloor(g,0,-.5,w+1.25,h+1.8);
 // A shallow floor transition marks the movement boundary, not a checkerboard.
 for(const x of [-w/2,w/2])box(g,[.035,.015,h],[x,.175,0],'#c4a781',.004);
 box(g,[w,.015,.045],[0,.175,h/2],'#b99f7c',.005);
 box(g,[w,.015,.035],[0,.175,-h/2],'#c4a781',.004);
 // Flat cotton runner and faded paw decals have no collisions or raised volumes.
 rug(g,-.05,.176,.35,w*.58,h*.35,'#e3ceb0',0);
 for(let i=0;i<5;i++)pawDecal(g,-w/2+.4+i*.28,h/2-.4-i*.41,'#c9b394',-.25);
 const paper=box(g,[.22,.003,.30],[w/2-.45,.179,.85],'#eee1ca',.001);paper.rotation.y=.3;paper.castShadow=false;
 for(const target of level.targets){const p=boardPoint(level,target.position),species=level.animals.find(a=>a.id===target.animalId)!.species,color=palette[species];
  const pad=ellipsoid(g,[.48,.018,.45],[p.x,.18,p.z],color);pad.castShadow=false;
  const ring=mesh(g,new T.TorusGeometry(.36,.009,6,32),'#e9ead2',[p.x,.202,p.z]);ring.rotation.x=-Math.PI/2;ring.castShadow=false;
  const tag=label(g,species==='cat'?'FISH':species==='dog'?'KIBBLE':'CARROT',.48,.13,[p.x,.202,p.z+.33],'#527464',color);tag.rotation.x=-Math.PI/2;
 }
 // Logical obstacle volumes keep the exact cell positions; foliage stays inside its footprint.
 for(const obstacle of level.obstacles){const p=boardPoint(level,obstacle);contact(g,p.x,.173,p.z,1.35,1.35);box(g,[.94,.39,.94],[p.x,.38,p.z],'#b0bd9b',.09);box(g,[.98,.07,.98],[p.x,.59,p.z],'#c5cfb0',.035);box(g,[.81,.022,.81],[p.x,.637,p.z],'#8e8268',.018);for(let i=0;i<3;i++)ellipsoid(g,[.19,.17,.19],[p.x+(i-1)*.21,.77,p.z+(i%2)*.12],'#a0b38c');box(g,[.30,.10,.01],[p.x,.38,p.z+.475],C.cream,.01);}
 // Tall wall only behind the play area; the front and sides remain cut away.
 box(g,[w+1.4,2.75,.15],[0,1.48,back],'#eee2cd');box(g,[w+1.5,.13,.28],[0,2.89,back],C.cream);
 box(g,[w+1.3,.72,.06],[0,.56,back+.10],'#a3bca9',.015);
 for(let x=-w/2-.6;x<w/2+.6;x+=.27)box(g,[.018,.70,.025],[x,.56,back+.14],'#91aa96',.004);
 box(g,[w+1.4,.075,.14],[0,.96,back+.12],C.cream,.015);
 // Arched glazed window and layered frame.
 const wx=-w*.20,wy=1.12;const shape=new T.Shape();shape.moveTo(-.8,0);shape.lineTo(.8,0);shape.lineTo(.8,.78);shape.absarc(0,.78,.8,0,Math.PI,false);shape.lineTo(-.8,0);
 const glass=mesh(g,new T.ShapeGeometry(shape,24),'#b7d0c4',[wx,wy,back+.09]);(glass.material as T.MeshStandardMaterial).emissive.set('#b4c8af');(glass.material as T.MeshStandardMaterial).emissiveIntensity=.10;
 const arch:number[][]=[];for(let i=0;i<=24;i++){const a=i*Math.PI/24;arch.push([wx+Math.cos(a)*.8,wy+.78+Math.sin(a)*.8,back+.16]);}tube(g,arch,.055,C.cream);
 for(const x of [-.8,0,.8])box(g,[.065,x===0?1.48:.85,.10],[wx+x,wy+(x===0?.74:.42),back+.16],C.cream,.015);
 box(g,[1.75,.10,.30],[wx,wy,back+.2],C.lightWood,.025);box(g,[1.6,.045,.10],[wx,wy+.78,back+.18],C.cream,.012);
 plant(g,wx-.53,wy+.05,back+.2,.42);
 picture(g,-w/2-.05,1.84,back+.10);
 // Open supply shelf and a small hanging wall sign.
 const supplies=placed(g,w/2-.1,1.17,back+.22);supplies.scale.setScalar(.66);shelf(supplies,0,0,0,1.6);
 const sign=placed(g,w*.28,2.13,back+.17);box(sign,[1.50,.55,.07],[0,0,0],'#d6b995',.07);label(sign,'COZY PAWS',1.35,.30,[0,0,.04],'#6f806c','#f5e8ce');
 tube(g,[[w*.28-.5,2.42,back+.14],[w*.28-.5,2.68,back+.14]],.01,'#9c917a');tube(g,[[w*.28+.5,2.42,back+.14],[w*.28+.5,2.68,back+.14]],.01,'#9c917a');
 // Low feeding stations are still directly adjacent to their original target cells.
 for(const target of level.targets){const p=boardPoint(level,target.food),species=level.animals.find(a=>a.id===target.animalId)!.species,color=palette[species];
  contact(g,p.x,.174,p.z,1.28,1.1);box(g,[1.02,.31,.78],[p.x,.33,p.z],'#d3ad83',.09);box(g,[1.09,.09,.86],[p.x,.53,p.z],C.cream,.05);
  for(const x of [-.36,.36])box(g,[.055,.27,.04],[p.x+x,.33,p.z+.40],'#b49470',.012);
  cylinder(g,.30,.34,.13,[p.x,.63,p.z],color);cylinder(g,.24,.24,.025,[p.x,.704,p.z],'#f8e9cd');
  if(species==='cat'){ellipsoid(g,[.20,.05,.09],[p.x,.75,p.z],'#86a19d');const tail=mesh(g,new T.ConeGeometry(.105,.15,3),'#86a19d',[p.x-.23,.75,p.z]);tail.rotation.z=Math.PI/2;ellipsoid(g,[.016,.012,.016],[p.x+.12,.792,p.z],'#455c57');}
  else if(species==='dog'){for(let i=0;i<9;i++)ellipsoid(g,[.045,.035,.04],[p.x+Math.sin(i*2.4)*.15,.75,p.z+Math.cos(i*2.4)*.15],'#ac7c4d');}
  else{const carrot=mesh(g,new T.ConeGeometry(.09,.36,10),'#dc9a5d',[p.x,.76,p.z]);carrot.rotation.z=1.1;ellipsoid(g,[.08,.03,.08],[p.x-.18,.78,p.z],'#95b188');}
  label(g,species==='cat'?'FISH':species==='dog'?'KIBBLE':'CARROT',.60,.14,[p.x,.34,p.z+.40],'#6f6755',color);
 }
 // A low boundary rail, entrance step and loosely placed objects beyond the grid.
 for(const x of [-w/2-.38,w/2+.38]){box(g,[.11,.58,.11],[x,.48,h/2+.12],'#b5bd9f',.025);ellipsoid(g,[.09,.06,.09],[x,.79,h/2+.12],C.cream);}
 box(g,[1.6,.12,.5],[.15,.05,h/2+.57],C.lightWood,.05);rug(g,.15,.115,h/2+.56,1.35,.44,'#99af9c');
 const welcome=label(g,'HELLO, LITTLE PAWS',1.12,.16,[.15,.127,h/2+.56],'#f1e9d4','#99af9c');welcome.rotation.x=-Math.PI/2;
 yarn(g,w/2+.36,.18,h/2-.52,'#cba3a0');bone(g,-w/2-.42,.18,h/2-.40,.6);
 book(g,-w/2-.42,.18,.4,'#b7c3b6',-.2);book(g,-w/2-.4,.25,.4,'#dec3a0',.16);
 plant(g,w/2+.36,.17,-h/2-.48,.64);
 return g;
}
