import * as T from 'three';
import {box,cylinder,ellipsoid,tube,mesh,label,colors as C} from '../../world/primitives';
import {bench,bicycle,placed,plant,tree,van} from './props';

export function buildStreet(w:number,h:number){
 const g=new T.Group();g.name='Paw Lane streetscape';const road=h/2+3.05,side=h/2+1.25;
 const left=-w/2-4.0,right=w/2+2.65,width=right-left,cx=(left+right)/2;
 box(g,[width+.7,.30,h+6.4],[cx,-.40,.8],'#bdc4af',.22);
 box(g,[width,.16,2.35],[cx,-.19,road],'#a1aaa8',.05);
 box(g,[width,.19,1.30],[cx,-.11,side],'#e0d4bf',.03);
 box(g,[width,.18,.20],[cx,-.08,side+.68],'#f1e6d2',.035);
 // Sidewalk joints do not continue into the playable floor.
 for(let x=left+.3;x<right;x+=.85)box(g,[.012,.005,1.20],[x,-.009,side],'#c8bda9',.002);
 for(let x=left+.45;x<right;x+=1.55)box(g,[.70,.006,.055],[x,-.102,road],'#e5e1cc',.002);
 for(let i=0;i<6;i++)box(g,[.82,.009,.18],[left+2.6,-.095,road-.85+i*.31],'#efe7cf',.003);
 box(g,[width,.15,.65],[cx,-.17,road+1.5],'#ded2bc',.03);
 for(const x of [right-1.0,left+.55]){
  cylinder(g,.13,.18,.12,[x,.03,side],'#87968a');cylinder(g,.035,.055,2.35,[x,1.23,side],'#7c9084');
  tube(g,[[x,2.35,side],[x,2.60,side],[x-.37,2.65,side]],.035,'#7c9084');
  const shade=cylinder(g,.06,.23,.15,[x-.37,2.57,side],C.green);const lamp=ellipsoid(g,[.16,.05,.16],[x-.37,2.48,side],'#fff0c5');(lamp.material as T.MeshStandardMaterial).emissive.set('#e8cc85');(lamp.material as T.MeshStandardMaterial).emissiveIntensity=.3;
 }
 // Street sign and letter box frame the entrance, without touching a gameplay cell.
 const post=placed(g,-w/2-1,.0,side);cylinder(post,.035,.04,1.6,[0,.8,0],'#85978a');box(post,[1.10,.29,.07],[0,1.50,0],'#a3b7a3',.04);label(post,'PAW LANE',.95,.18,[0,1.50,.04],C.cream,'#a3b7a3');
 bench(g,w/2+1.28,0,side-.1,-.05);bicycle(g,-w/2-2.55,0,side,.10);
 const mailbox=placed(g,w/2+1.9,0,side-.45);cylinder(mailbox,.04,.055,.6,[0,.3,0],'#7e9189');box(mailbox,[.42,.49,.38],[0,.82,0],'#ca9d8d',.10);box(mailbox,[.27,.035,.013],[0,.91,.195],'#7f8170',.008);
 const car=van(g,w/2+.05,-.02,road+.33);car.rotation.y=Math.PI;
 // A small planting verge and soft tree crowns at the edges of the cutaway.
 const crowns:T.Group[]=[];crowns.push(tree(g,left-.8,-.03,-h/2-.3,.9));crowns.push(tree(g,right-.55,-.03,.25,.96));crowns.push(tree(g,left+.65,-.03,road+1.30,.85));
 for(const [x,z] of [[right-.55,1.35],[left+.45,2.0]]){box(g,[.8,.18,1.40],[x,.05,z],'#d2c9ae',.10);for(let i=0;i<4;i++){ellipsoid(g,[.31,.28,.31],[x,.31,z-.4+i*.27],i%2?'#aab993':'#96ab88');for(let k=0;k<2;k++)ellipsoid(g,[.055,.055,.05],[x-.12+k*.24,.53,z-.4+i*.27],'#e4b6a4');}}
 // Neighbouring shop fragment: facade, inset window and scalloped canopy.
 const nx=-w/2-2.3,nz=-h/2-1.85;
 box(g,[3.1,2.7,.55],[nx,1.05,nz],'#d7b6a3',.06);box(g,[3.26,.14,.72],[nx,2.44,nz],C.cream,.04);
 box(g,[2.30,1.32,.035],[nx,1.0,nz+.30],'#b0c7c3',.06);box(g,[.06,1.40,.09],[nx,1.0,nz+.35],C.cream,.02);box(g,[2.45,.09,.30],[nx,.34,nz+.37],C.cream,.02);
 label(g,'THE LITTLE FLORIST',2.65,.27,[nx,2.09,nz+.29],'#796e5b','#d7b6a3');
 for(let i=0;i<9;i++){const a=box(g,[.29,.06,.72],[nx-1.16+i*.29,1.79,nz+.54],i%2?'#f0dfc4':'#a3b29b',.018);a.rotation.x=-.12;box(g,[.29,.17,.07],[nx-1.16+i*.29,1.68,nz+.9],i%2?'#f0dfc4':'#a3b29b',.05);}
 return {group:g,update(t:number,reduced:boolean){for(let i=0;i<crowns.length;i++){crowns[i].rotation.z=reduced?0:Math.sin(t*.8+i)*.025;crowns[i].rotation.x=reduced?0:Math.sin(t*.65+i)*.012;}}};
}
