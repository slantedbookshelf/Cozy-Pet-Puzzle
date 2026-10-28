import * as T from 'three';
import {ellipsoid,mesh,tube} from '../world/primitives';
export type Species='cat'|'dog'|'rabbit';
export class Pet {
 root=new T.Group();body=new T.Group();head=new T.Group();tail=new T.Group();materials:T.MeshStandardMaterial[]=[];hovered=false; excitement=0;
 limbs:T.Group[]=[];ears:T.Group[]=[];eyes:T.Group[]=[];jaw=new T.Group();
 constructor(public species:Species,public name:string,position:[number,number,number],public phase:number) {
 const fur=species==='cat'?'#e8aa6b':species==='dog'?'#c59169':'#eee6d6',cream='#fff0d8',dark='#443a34';
 this.root.position.set(...position);this.root.rotation.y=species==='rabbit'?.13:-.12;this.root.add(this.body);this.body.add(this.head,this.tail);
 ellipsoid(this.body,[.43,.54,.39],[0,.63,0],fur);ellipsoid(this.body,[.29,.37,.12],[0,.60,.31],cream);
 for(const z of [-.18,.23])for(const x of [-.27,.27]){const leg=new T.Group();leg.position.set(x,z<0?.32:.60,z);this.body.add(leg);this.limbs.push(leg);ellipsoid(leg,z<0?[.17,.15,.23]:[.12,.23,.14],[0,-.11,.04],fur);}
 this.head.position.set(0,1.13,.10);ellipsoid(this.head,[.48,.42,.39],[0,0,0],fur);
 if(species==='cat') {
  for(const x of [-.29,.29]){const pivot=new T.Group();pivot.position.set(x,.25,-.015);this.head.add(pivot);this.ears.push(pivot);const ear=mesh(pivot,new T.ConeGeometry(.23,.46,3),fur,[0,.14,0]);ear.rotation.z=-Math.sign(x)*.22;const inner=mesh(pivot,new T.ConeGeometry(.125,.28,3),'#d99289',[0,.15,.10]);inner.rotation.z=-Math.sign(x)*.22;}
  for(const x of [-.19,0,.19]){const stripe=ellipsoid(this.head,[.048,.14,.025],[x,.27,.292],'#c3874b');stripe.rotation.z=-x;}
  tube(this.tail,[[0,.36,-.2],[.43,.40,-.45],[.64,.67,-.44],[.61,.9,-.34]],.105,fur);
  for(const s of [-1,1])for(let i=0;i<2;i++)tube(this.head,[[s*.26,-.09,.33],[s*.52,-.06-i*.08,.31]],.009,'#8f735c');
 }else if(species==='dog') {
  for(const x of [-.46,.46]){const pivot=new T.Group();pivot.position.set(x,.2,-.01);this.head.add(pivot);this.ears.push(pivot);const ear=ellipsoid(pivot,[.18,.39,.17],[0,-.21,0],'#8d6249');ear.rotation.z=Math.sign(x)*.16;}
  ellipsoid(this.head,[.13,.32,.035],[0,.08,.355],cream);tube(this.tail,[[0,.4,-.25],[.1,.65,-.5],[.3,.87,-.54]],.11,fur);
 } else {
  for(const x of [-.23,.23]){const ear=new T.Group();ear.position.set(x,.28,-.06);this.head.add(ear);this.ears.push(ear);ellipsoid(ear,[.14,.52,.13],[0,.36,0],fur);ellipsoid(ear,[.075,.38,.035],[0,.38,.11],'#e5afa9');}
  ellipsoid(this.tail,[.23,.23,.22],[.31,.45,-.30],cream);
 }
 for(const x of [-.18,.18]){const eye=new T.Group();eye.position.set(x,.035,.355);this.head.add(eye);this.eyes.push(eye);ellipsoid(eye,[.055,.073,.036],[0,0,0],dark);ellipsoid(eye,[.015,.021,.012],[-.013,.024,.029],'#ffffff');ellipsoid(this.head,[.09,.045,.017],[x*1.55,-.09,.32],'#e7a699');}
 for(const x of [-.095,.095])ellipsoid(this.head,[.13,.10,.085],[x,-.13,.345],cream);
 ellipsoid(this.head,[.063,.045,.038],[0,-.092,.428],species==='dog'?dark:'#bd7d75');
 this.head.add(this.jaw);tube(this.jaw,[[0,-.12,.416],[0,-.19,.421],[.06,-.20,.407]],.012,dark);
 ellipsoid(this.jaw,[.09,.035,.04],[0,-.205,.378],cream);
 // Collar and small brass tag provide a common character language.
 const collar=mesh(this.body,new T.TorusGeometry(.30,.043,10,40),species==='cat'?'#91ad98':species==='dog'?'#d88d79':'#c6b0c7',[0,.91,.08]);collar.rotation.x=Math.PI/2;
 ellipsoid(this.body,[.065,.08,.025],[0,.88,.39],'#d9b56d');
 this.root.traverse(o=>{o.userData.pet=this;if(o instanceof T.Mesh)this.materials.push(o.material as T.MeshStandardMaterial);});
 }
 react(){this.excitement=1;}
 update(t:number,dt:number,reduced:boolean){this.resetPose();const s=reduced?0:Math.sin(t*2+this.phase);this.body.scale.y=1+s*.018;this.head.rotation.z=s*.045;this.head.rotation.y=reduced?0:Math.sin(t*.8+this.phase)*.09;this.tail.rotation.y=reduced?0:Math.sin(t*(this.species==='dog'?6:2)+this.phase)*.18;this.excitement=Math.max(0,this.excitement-dt*.8);this.body.position.y=reduced?0:Math.sin(this.excitement*Math.PI*4)*this.excitement*.1;
 for(const mat of this.materials){mat.emissive.set('#e0b76c');mat.emissiveIntensity=T.MathUtils.damp(mat.emissiveIntensity,this.hovered?.18:0,12,dt);}
 }
 resetPose(){this.body.position.set(0,0,0);this.body.rotation.set(0,0,0);this.body.scale.set(1,1,1);this.head.position.set(0,1.13,.1);this.head.rotation.set(0,0,0);this.jaw.position.y=0;for(const l of this.limbs)l.rotation.set(0,0,0);for(const e of this.ears)e.rotation.set(0,0,this.species==='rabbit'?-Math.sign(e.position.x)*.16:0);for(const e of this.eyes)e.scale.y=1;}
 run(t:number,weight:number,crouch:number,settle:number){
  const rabbit=this.species==='rabbit',dog=this.species==='dog';const cycle=t*(rabbit?17:dog?23:28),stride=Math.sin(cycle);
  this.limbs.forEach((leg,i)=>{leg.rotation.x=(rabbit?(i<2?-1:1)*stride:Math.sin(cycle+(i===0||i===3?0:Math.PI)))*(dog?.65:.48)*weight;});
  this.body.position.y=(rabbit?Math.max(0,stride)*.16:Math.abs(stride)*(dog?.07:.035))*weight-crouch*.05;
  this.body.scale.y=1-crouch*.07-settle*.035;this.body.rotation.x=.10*weight-.08*settle;
  this.head.rotation.x=-.06*weight;this.tail.rotation.y=Math.sin(cycle*.55)*(dog?.45:.22)*weight;
  this.ears.forEach((e,i)=>{e.rotation.x=Math.sin(cycle-.7+i*.25)*(rabbit?.22:dog?.28:.07)*weight;});
 }
 expectFood(t:number,reduced:boolean){this.head.rotation.y=0;this.head.rotation.x=.10+(reduced?0:Math.sin(t*3+this.phase)*.055);this.tail.rotation.y=reduced?0:Math.sin(t*5+this.phase)*.22;}
 eat(t:number,weight:number,reduced:boolean){const chew=reduced?0:Math.sin(t*17);this.head.rotation.y=0;this.head.rotation.x=(.33+chew*.035)*weight;this.head.position.z+=.13*weight;this.body.rotation.x=.06*weight;this.jaw.position.y=-Math.abs(chew)*.035*weight;this.eyes.forEach(e=>e.scale.y=1-.35*weight);}
 happy(t:number,weight:number,reduced:boolean){const dog=this.species==='dog',rabbit=this.species==='rabbit';this.head.rotation.x=-.17*weight;this.eyes.forEach(e=>e.scale.y=1-.80*weight);this.tail.rotation.y=reduced?0:Math.sin(t*(dog?22:9))*(dog?.55:.3)*weight;const hop=reduced?0:Math.max(0,Math.sin(t*(rabbit?15:10)))*weight;this.body.position.y=hop*(rabbit?.18:dog?.10:.02);this.body.scale.y=1-hop*.04;this.limbs.forEach((l,i)=>l.rotation.x=hop*(i<2?-.3:.25));this.ears.forEach(e=>e.rotation.x=hop*(rabbit?.3:.12));}
}
