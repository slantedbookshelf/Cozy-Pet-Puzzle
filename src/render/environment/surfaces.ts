import * as T from 'three';
import {box,mesh} from '../../world/primitives';

/** World-space floor planks are independent of the puzzle cell spacing. */
export function woodFloor(g:T.Group,cx:number,cz:number,w:number,d:number){
 box(g,[w,.08,d],[cx,.10,cz],'#ddbc95',.025);
 const rows=Math.ceil(d/.28),depth=d/rows;
 for(let row=0;row<rows;row++){
  let left=-w/2;let col=0;
  while(left<w/2-.01){const length=Math.min(col===0?(.72+(row%3)*.50):1.95,w/2-left);mesh(g,new T.BoxGeometry(length-.009,.028,depth-.009),['#dfc29f','#e4c9a7','#e2c5a1','#e7cdad'][(row*7+col*3)%4],[cx+left+length/2,.154,cz-d/2+depth*(row+.5)]);left+=length;col++;}
 }
}
export function contactFactory(){
 const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const c=canvas.getContext('2d')!;
 const grad=c.createRadialGradient(32,32,3,32,32,31);grad.addColorStop(0,'rgba(72,57,41,.23)');grad.addColorStop(.45,'rgba(72,57,41,.11)');grad.addColorStop(1,'rgba(72,57,41,0)');c.fillStyle=grad;c.fillRect(0,0,64,64);
 const texture=new T.CanvasTexture(canvas);
 return (g:T.Object3D,x:number,y:number,z:number,w:number,d:number)=>{const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);g.add(m);return m;};
}
export function pawDecal(g:T.Object3D,x:number,z:number,color='#cab394',angle=0){
 const group=new T.Group();group.position.set(x,.174,z);group.rotation.y=angle;g.add(group);
 const pad=mesh(group,new T.CircleGeometry(.075,14),color,[0,0,0]);pad.rotation.x=-Math.PI/2;pad.scale.y=.8;pad.castShadow=false;
 for(let i=0;i<3;i++){const toe=mesh(group,new T.CircleGeometry(.030,10),color,[(i-1)*.065,0,-.09+Math.abs(i-1)*.015]);toe.rotation.x=-Math.PI/2;toe.castShadow=false;}
}
