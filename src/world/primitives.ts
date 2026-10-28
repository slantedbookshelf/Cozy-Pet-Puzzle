import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export const colors = {cream: '#fff2d9', wood: '#cb9164', lightWood: '#e9bb86', green: '#97b7a2', pink: '#e6a8a2', dark: '#56483c'};
export function material(color: T.ColorRepresentation, roughness = .8) { return new T.MeshStandardMaterial({color, roughness}); }
export function mesh(parent:T.Object3D, geometry:T.BufferGeometry, color:T.ColorRepresentation, position:number[]=[0,0,0]) {
  const m=new T.Mesh(geometry,material(color)); m.position.set(position[0],position[1],position[2]); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
export function box(p:T.Object3D,size:number[],pos:number[],color:T.ColorRepresentation,r=.06) {return mesh(p,new RoundedBoxGeometry(size[0],size[1],size[2],2,r),color,pos);}
export function ellipsoid(p:T.Object3D,size:number[],pos:number[],color:T.ColorRepresentation) {const m=mesh(p,new T.SphereGeometry(1,24,16),color,pos);m.scale.set(size[0],size[1],size[2]);return m;}
export function cylinder(p:T.Object3D,top:number,bottom:number,h:number,pos:number[],color:T.ColorRepresentation) {return mesh(p,new T.CylinderGeometry(top,bottom,h,32),color,pos);}
export function tube(p:T.Object3D,points:number[][],radius:number,color:T.ColorRepresentation) {return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),32,radius,10,false),color);}
export function label(p:T.Object3D,text:string,w:number,h:number,pos:number[],ink='#655342',bg='#fff4df') {
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(1024*h/w);const ctx=canvas.getContext('2d')!;
 ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=ink;ctx.font=`600 ${Math.round(canvas.height*.47)}px "Trebuchet MS", sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,canvas.height*.53,950);
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:1}));m.position.set(...pos as [number,number,number]);p.add(m);return m;
}
