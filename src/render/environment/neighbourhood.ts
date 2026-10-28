import * as T from 'three';
import {box,cylinder,ellipsoid,label} from '../../world/primitives';
import {placed,bench,bicycle,plant,cardboard,van,tree} from './props';

// Planned parcels, not random scatter. The centre is reserved for the existing shop.
function storefront(parent:T.Group,x:number,z:number,w:number,d:number,height:number,color:string,name:string,awning:string){
 const g=placed(parent,x,0,z);g.name=name;
 box(g,[w+.8,.18,d+1.2],[0,-.18,.2],'#dfd3bb',.08);
 box(g,[w,height,d],[0,height/2-.08,0],color,.10);
 box(g,[w+.23,.18,d+.23],[0,height-.03,0],'#f1e5cc',.06);
 box(g,[w-.20,.13,d-.2],[0,height+.09,0],'#b7b5a1',.04);
 for(const xx of [-w*.27,w*.27]){
  box(g,[w*.36,height*.43,.055],[xx,height*.37,d/2+.035],'#8ba9a5',.05);
  for(const sx of [-1,1])box(g,[.055,height*.45,.09],[xx+sx*w*.185,height*.37,d/2+.065],'#efdfc1',.015);
  box(g,[w*.39,.06,.10],[xx,height*.37,d/2+.08],'#efdfc1',.015);
 }
 // Side windows, roof vent, drainpipe, projecting striped canopy and entrance.
 for(const zz of [-d*.24,d*.24])box(g,[.025,.7,.65],[w/2+.025,height*.58,zz],'#9ab2ac',.04);
 cylinder(g,.045,.045,height-.2,[-w/2+.13,height/2,d/2+.04],'#b6b19a');
 box(g,[.65,.38,.65],[w*.25,height+.3,-d*.2],'#d0c7af',.06);
 const front=d/2+.1;
 box(g,[.66,height*.56,.08],[0,height*.28,front],'#f0e0bd',.04);
 box(g,[.48,height*.4,.025],[0,height*.32,front+.05],'#aac2b8',.025);
 cylinder(g,.035,.035,.07,[.19,height*.27,front+.08],'#b99b64').rotation.x=Math.PI/2;
 box(g,[.95,.12,.45],[0,-.03,front+.18],'#f0e3cb',.03);
 label(g,name,w*.78,.28,[0,height*.82,front+.02],'#5b7668',color);
 const stripes=Math.round(w/.3);
 for(let i=0;i<stripes;i++){
  const xx=-w/2+(i+.5)*w/stripes;
  const a=box(g,[w/stripes+.004,.07,.70],[xx,height*.68,front+.27],i%2?'#f5e8cd':awning,.015);a.rotation.x=.12;
  box(g,[w/stripes+.004,.18,.07],[xx,height*.68-.09,front+.62],i%2?'#f5e8cd':awning,.035);
 }
 plant(g,-w*.43,0,front+.30,.85);plant(g,w*.43,0,front+.30,.75);
 return g;
}
function table(g:T.Group,x:number,z:number){
 cylinder(g,.47,.47,.09,[x,.70,z],'#e4c5a0');cylinder(g,.06,.09,.65,[x,.33,z],'#929b85');cylinder(g,.27,.30,.07,[x,.02,z],'#929b85');
 for(const dx of [-.65,.65]){cylinder(g,.22,.22,.07,[x+dx,.39,z],'#b5bca1');for(const zz of [-.13,.13])box(g,[.04,.38,.04],[x+dx,.18,z+zz],'#889a88',.01);box(g,[.35,.3,.05],[x+dx,.57,z-.18],'#b5bca1',.04);}
 cylinder(g,.07,.06,.12,[x,.81,z],'#fff0d8');
}
export function buildNeighbourhood(w:number,h:number){
 const g=new T.Group();g.name='Continuous neighbourhood parcels';const road=h/2+3.05;
 // All paths join the original east-west Paw Lane. No edge of the miniature base is exposed.
 box(g,[90,.12,90],[0,-.58,0],'#bac5a7',.02);
 box(g,[90,.10,3.0],[0,-.29,road],'#a1aaa8',.02);
 box(g,[90,.12,1.0],[0,-.24,road+2.0],'#ddd2bd',.02);
 box(g,[90,.12,1.0],[0,-.24,road-2.0],'#ddd2bd',.02);
 for(const x of [-10.5,10.5]){
  box(g,[2.8,.10,78],[x,-.29,0],'#a1aaa8',.02);
  for(const dx of [-1.85,1.85])box(g,[.9,.12,78],[x+dx,-.24,0],'#ded5c1',.02);
  for(let z=-35;z<36;z+=2)if(Math.abs(z-road)>2)box(g,[.06,.006,.80],[x,-.232,z],'#e8dfc6',.002);
  for(let i=0;i<6;i++)box(g,[.23,.009,1.20],[x-1.1+i*.44,-.23,road+1.25],'#f1e7ce',.002);
 }
 for(let x=-42;x<44;x+=2)if(Math.abs(x)>8&&Math.abs(Math.abs(x)-10.5)>2)box(g,[.85,.006,.06],[x,-.232,road],'#e8dfc6',.002);
 // A rear pedestrian alley makes the cutaway shop part of a larger building block.
 box(g,[19,.13,2.2],[0,-.24,-h/2-3.0],'#dcd0b7',.02);
 storefront(g,1.3,-h/2-6.0,4.8,2.8,3.0,'#dbc5a7','MAPLE MARKET','#95ad9c');
 storefront(g,-5.0,-h/2-6.1,4.2,3,3.7,'#d3b6a5','MAISON 08','#c6a088');
 storefront(g,6.8,-2.5,2.8,3.1,2.35,'#e1c6ac','MELLOW CAFE','#be9885');
 table(g,6.4,1.0);table(g,7.0,2.3);bicycle(g,8.0,0,3.55,-.3);
 bench(g,-7.7,-.12,.6,-Math.PI/2);
 // Across the lane: a low public garden leaves sight lines to the entire puzzle clear.
 const gardenZ=road+4.8;
 box(g,[9,.12,3.8],[0,-.21,gardenZ],'#9fb293',.09);
 box(g,[9,.04,.65],[0,-.13,gardenZ],'#e1d2b6',.02);
 for(const x of [-3.3,3.3]){
  box(g,[1.2,.23,2.6],[x,-.02,gardenZ],'#d9c8aa',.08);
  for(let i=0;i<5;i++){ellipsoid(g,[.39,.30,.31],[x,.24,gardenZ-1+i*.5],i%2?'#a1b68d':'#8fa984');ellipsoid(g,[.09,.08,.09],[x+.12,.48,gardenZ-.9+i*.5],'#e6b9a2');}
 }
 bench(g,-1.4,-.12,gardenZ+1.1);bench(g,1.4,-.12,gardenZ+1.1);
 for(const x of [-6.8,6.5])storefront(g,x,road+8.8,3.5,2.7,2.2,x<0?'#c5c6ad':'#d8bdb0',x<0?'BLOOM':'BAKERY',x<0?'#a4b59c':'#c89f8c');
 // Outer city blocks only become visible in tall or wide windows.
 for(const x of [-16,16,-24,24])for(const z of [-14,-5,road+5,road+14])storefront(g,x,z,4.8,4,2.8+(Math.abs(x)%3)*.25,Math.abs(z)%2<1?'#c6cbb8':'#d7c4ae','PAW DISTRICT','#a2b4a3');
 for(const z of [-23,road+22])for(const x of [-6,1,7])storefront(g,x,z,4.5,3.5,3,'#c7bba8','HOME','#a8b4a0');
 const crowns:T.Group[]=[];
 for(const [x,z,s] of [[-8,-4,1],[8,-6,.95],[-6.4,gardenZ,.9],[6,gardenZ,.9],[-13,-2,1.1],[13,1,1.1],[-3,-h/2-3, .7],[8,-15,1],[-8,17,1],[8,19,1]])crowns.push(tree(g,x,-.15,z,s));
 cardboard(g,8,0,-.4,.48,.2);van(g,-15,-.18,road);van(g,18,-.18,road);
 // Remote blocks do not consume the central shop's shadow map.
 g.traverse(o=>{if(o instanceof T.Mesh)o.castShadow=false;});
 return {group:g,update(t:number,reduced:boolean){crowns.forEach((c,i)=>{c.rotation.z=reduced?0:Math.sin(t*.65+i)*.018;});}};
}
