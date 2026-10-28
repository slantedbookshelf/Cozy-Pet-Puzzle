import * as T from 'three';
import {box,ellipsoid,cylinder,tube,mesh,label,colors as C} from '../../world/primitives';

export function placed(parent:T.Object3D,x:number,y:number,z:number,angle=0){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;parent.add(g);return g;}
export function plant(parent:T.Object3D,x:number,y:number,z:number,s=1){
 const g=placed(parent,x,y,z);g.scale.setScalar(s);
 cylinder(g,.25,.18,.40,[0,.20,0],'#d5a48b');cylinder(g,.27,.27,.06,[0,.40,0],'#e9bda0');cylinder(g,.22,.22,.02,[0,.425,0],'#756958');
 for(let i=0;i<7;i++){const a=i*2.4;const leaf=ellipsoid(g,[.105,.29,.05],[Math.sin(a)*.18,.60+(i%3)*.08,Math.cos(a)*.18],i%2?'#849e77':'#a0b58b');leaf.rotation.set(Math.cos(a)*.6,a,Math.sin(a)*.6);}
 return g;
}
export function jar(g:T.Object3D,x:number,y:number,z:number,color:string){cylinder(g,.13,.13,.29,[x,y+.145,z],color);cylinder(g,.145,.145,.055,[x,y+.31,z],C.wood);box(g,[.15,.12,.012],[x,y+.15,z+.13],C.cream,.01);}
export function book(g:T.Object3D,x:number,y:number,z:number,color:string,angle=0){const b=placed(g,x,y,z,angle);box(b,[.40,.065,.30],[0,.045,0],color,.014);box(b,[.36,.035,.285],[.01,.045,0],'#f0e5cf',.004);return b;}
export function yarn(g:T.Object3D,x:number,y:number,z:number,color='#d4a3a0'){
 ellipsoid(g,[.17,.16,.17],[x,y+.16,z],color);for(let i=0;i<3;i++){const ring=mesh(g,new T.TorusGeometry(.158,.009,5,20),'#efd2bf',[x,y+.16,z]);ring.rotation.set(i*.8,.4,i*.5);}
 tube(g,[[x+.1,y+.05,z],[x+.3,y+.014,z+.15],[x+.45,y+.014,z+.1]],.012,color);
}
export function bone(g:T.Object3D,x:number,y:number,z:number,angle=.4){const b=placed(g,x,y,z,angle);box(b,[.35,.09,.12],[0,.06,0],C.cream,.04);for(const a of [-.19,.19])for(const z of [-.06,.06])ellipsoid(b,[.075,.06,.075],[a,.06,z],C.cream);}
export function bed(g:T.Object3D,x:number,y:number,z:number,color='#b1bea3',angle=0){
 const b=placed(g,x,y,z,angle);ellipsoid(b,[.68,.16,.52],[0,.16,0],color);const rim=mesh(b,new T.TorusGeometry(.47,.13,10,28),color,[0,.28,0]);rim.rotation.x=Math.PI/2;rim.scale.x=1.35;
 ellipsoid(b,[.53,.11,.39],[0,.22,0],'#eedbc2');box(b,[.42,.12,.30],[.16,.33,-.07],'#dfa99e',.1);return b;
}
export function cardboard(g:T.Object3D,x:number,y:number,z:number,s=.6,angle=0){const b=placed(g,x,y,z,angle);box(b,[s,s*.75,s],[0,s*.375,0],'#cda77d',.025);box(b,[s+.015,.035,s+.015],[0,s*.76,0],'#d9b68d',.01);box(b,[s*.18,.008,s+.02],[0,s*.785,0],'#eee1be',.002);box(b,[s*.40,s*.23,.01],[0,s*.42,s*.503],C.cream,.006);return b;}
export function shoppingBag(g:T.Object3D,x:number,y:number,z:number){const b=placed(g,x,y,z,-.15);box(b,[.42,.49,.26],[0,.245,0],'#e7c7a5',.03);for(const z of [-.085,.085])tube(b,[[-.12,.47,z],[-.1,.64,z],[.1,.64,z],[.12,.47,z]],.014,'#b48d68');label(b,'PAWS',.30,.10,[0,.27,.135]);}
export function shelf(g:T.Object3D,x:number,y:number,z:number,width=1.8){
 const b=placed(g,x,y,z);box(b,[width,1.75,.09],[0,.92,-.21],'#d3b28a');
 for(const x of [-width/2,width/2])box(b,[.09,1.9,.50],[x,.97,0],C.lightWood,.025);
 for(const y of [.12,.73,1.34,1.9])box(b,[width+.15,.075,.56],[0,y,0],C.lightWood,.025);
 for(let row=0;row<3;row++)for(let i=0;i<4;i++){const x=-width*.36+i*width*.24,y=.16+row*.61;if((i+row)%3===0){const packet=box(b,[.27,.40,.21],[x,y+.2,0],['#b2c2a7','#ddb2a7','#c1cbd0'][row],.04);packet.rotation.z=(i%2?-.06:.05);box(b,[.16,.12,.012],[x,y+.19,.112],C.cream,.008);}else jar(b,x,y,0,['#e5caa0','#b1c0a3','#d9aaa1'][row]);}
 return b;
}
export function picture(g:T.Object3D,x:number,y:number,z:number,kind='paw'){
 box(g,[.75,.93,.07],[x,y,z],C.wood,.025);box(g,[.64,.81,.015],[x,y,z+.045],C.cream,.01);
 if(kind==='paw'){ellipsoid(g,[.17,.14,.016],[x,y-.05,z+.061],'#c4b49b');for(let i=0;i<3;i++)ellipsoid(g,[.065,.08,.015],[x+(i-1)*.14,y+.17-Math.abs(i-1)*.04,z+.064],'#c4b49b');}
 else {ellipsoid(g,[.18,.19,.014],[x,y,z+.06],'#b8c4a3');ellipsoid(g,[.08,.19,.014],[x-.12,y+.20,z+.06],'#b8c4a3');ellipsoid(g,[.08,.19,.014],[x+.12,y+.20,z+.06],'#b8c4a3');}
}
export function rug(g:T.Object3D,x:number,y:number,z:number,w:number,d:number,color:string,angle=0){const r=placed(g,x,y,z,angle);box(r,[w,.012,d],[0,0,0],color,.005);for(const dx of [-w/2+.06,w/2-.06])box(r,[.025,.003,d-.10],[dx,.008,0],'#e8d5b8',.001);for(let i=0;i<10;i++)for(const side of [-1,1])box(r,[.025,.007,.10],[-w*.43+i*w*.086,.001,side*(d/2+.04)],'#e4ccb0',.003);return r;}
export function bench(g:T.Object3D,x:number,y:number,z:number,angle=0){const b=placed(g,x,y,z,angle);for(const x of [-.64,.64]){box(b,[.08,.50,.65],[x,.25,0],'#7c8c80',.025);box(b,[.08,.70,.08],[x,.62,-.28],'#7c8c80',.025);}for(let i=0;i<4;i++)box(b,[1.55,.07,.12],[0,.52,-.23+i*.15],'#cda67c',.02);for(let i=0;i<3;i++)box(b,[1.55,.12,.06],[0,.69+i*.15,-.29],'#cda67c',.02);}
export function bicycle(g:T.Object3D,x:number,y:number,z:number,angle=0){
 const b=placed(g,x,y,z,angle);for(const x of [-.55,.55]){const wheel=mesh(b,new T.TorusGeometry(.32,.035,8,28),'#66716c',[x,.35,0]);const rim=mesh(b,new T.TorusGeometry(.28,.012,5,24),'#c4c8b8',[x,.35,0]);for(let i=0;i<6;i++){const a=i*Math.PI/3;tube(b,[[x,.35,0],[x+Math.cos(a)*.28,.35+Math.sin(a)*.28,0]],.006,'#b7bfb2');}}
 const points=[[-.55,.35,0],[-.25,.82,0],[.12,.35,0],[.4,.88,0],[.55,.35,0]];
 tube(b,[points[0],points[1],points[2],points[0]],.025,'#c58c7a');tube(b,[points[1],points[3],points[2]],.025,'#c58c7a');tube(b,[points[3],[.36,1.05,0],[.50,1.08,.10]],.023,'#65766c');tube(b,[[.55,.35,0],[.4,.88,0]],.025,'#c58c7a');box(b,[.23,.06,.14],[-.25,.85,0],'#736958',.025);box(b,[.27,.22,.25],[.55,.90,0],'#d7b88f',.035);
 return b;
}
export function van(g:T.Object3D,x:number,y:number,z:number){
 const b=placed(g,x,y,z);box(b,[2.05,.58,.95],[0,.55,0],'#adc0b6',.18);box(b,[1.18,.67,.94],[-.35,1.08,0],'#e9dfc9',.12);box(b,[.68,.48,.88],[.53,1.04,0],'#adc0b6',.12);
 box(b,[.035,.30,.69],[.88,1.11,0],'#748f91',.015);for(const z of [-.48,.48]){box(b,[.44,.29,.025],[.51,1.12,z],'#8eaaa8',.025);for(const x of [-.68,.63]){const wheel=cylinder(b,.21,.21,.12,[x,.30,z],'#65706a');wheel.rotation.x=Math.PI/2;const hub=cylinder(b,.10,.10,.125,[x,.30,z],'#d4c9ae');hub.rotation.x=Math.PI/2;}}
 box(b,[.07,.13,.76],[1.03,.43,0],C.cream,.03);for(const z of [-.31,.31])box(b,[.035,.12,.16],[1.045,.69,z],'#f5dfab',.025);
 label(b,'PAW POST',.83,.21,[-.37,1.13,.481],'#758a77','#e9dfc9');cardboard(b,-.5,1.44,0,.4,.06);return b;
}
export function tree(g:T.Object3D,x:number,y:number,z:number,scale=1){
 const b=placed(g,x,y,z);b.scale.setScalar(scale);cylinder(b,.47,.5,.18,[0,.09,0],'#c1b79d');cylinder(b,.40,.4,.025,[0,.19,0],'#91a581');cylinder(b,.065,.12,1.4,[0,.85,0],'#a18767');
 const crown=placed(b,0,1.45,0);crown.userData.dynamic=true;
 for(let i=0;i<5;i++){const a=i*2.4;const m=mesh(crown,new T.IcosahedronGeometry(.54,2),['#a0b38b','#90a682','#afbc93'][i%3],[Math.sin(a)*.25,.18+(i%2)*.32,Math.cos(a)*.25]);m.scale.y=1.12;}
 return crown;
}
