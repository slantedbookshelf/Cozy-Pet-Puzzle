import * as T from 'three';
import {box,cylinder,ellipsoid,tube,label,colors as C} from '../../world/primitives';
import {bed,bone,book,cardboard,jar,picture,placed,plant,rug,shoppingBag,yarn} from './props';
import {woodFloor} from './surfaces';

/** Open annexes live entirely beyond the left edge of the animal area. */
export function buildRooms(w:number,h:number){
 const g=new T.Group();g.name='Washroom and pet lounge (decoration only)';
 const x=-w/2-2.25,width=2.75,back=-h/2-1.05,front=h/2+.45,depth=front-back,split=-.3;
 box(g,[width+.18,.34,depth],[x,-.02,(back+front)/2],C.lightWood,.10);
 woodFloor(g,x,(split+front)/2,width,front-split);
 // Tiny porcelain mosaic in the wash room, unlike the continuous oak shop floor.
 for(let row=0;row<7;row++)for(let col=0;col<6;col++)box(g,[width/6-.01,.04,(split-back)/7-.01],[x-width/2+(col+.5)*width/6,.17,back+(row+.5)*(split-back)/7],(row+col)%3?'#c9d8d0':'#dae3d8',.008);
 box(g,[width+.2,2.25,.14],[x,1.12,back],'#eadbce');box(g,[width+.22,.10,.24],[x,2.28,back],C.cream);
 // Left cutaway wall and low room divider expose the interiors to the player.
 box(g,[.14,1.05,depth],[x-width/2,.57,(front+back)/2],'#d3c3b6');box(g,[.21,.08,depth],[x-width/2,1.13,(front+back)/2],C.cream);
 box(g,[1.65,.63,.13],[x-.5,.45,split],'#e3d4c1');box(g,[1.75,.08,.20],[x-.5,.79,split],C.cream);
 label(g,'BUBBLES & BRUSHES',2.15,.23,[x,1.90,back+.08],'#8a8d7c','#eadbce');
 // Rounded tub with inset basin and a curved shower fixture.
 const tub=placed(g,x-.25,.19,back+.8,-.05);box(tub,[1.64,.57,.83],[0,.29,0],'#f6eddc',.21);box(tub,[1.38,.08,.62],[0,.58,0],'#a5c5c0',.16);ellipsoid(tub,[.55,.015,.20],[0,.632,0],'#c6dfd8');
 tube(tub,[[.48,.58,-.25],[.48,1.27,-.25],[.30,1.4,-.25],[.12,1.32,-.25]],.025,'#b1b5a5');cylinder(tub,.085,.10,.045,[.12,1.30,-.25],'#c2c7b5');
 for(let i=0;i<3;i++){const bottle=cylinder(g,.075,.075,.25,[x+.95,.30+i*.01,back+.55+i*.27],['#d7b1ad','#c5d5b6','#f0d7a4'][i]);cylinder(g,.04,.04,.045,[x+.95,.45+i*.01,back+.55+i*.27],C.cream);}
 box(g,[.66,.80,.53],[x+.85,.60,-.95],'#b2c4b7',.06);box(g,[.72,.07,.58],[x+.85,1.04,-.95],C.cream,.03);
 for(let i=0;i<3;i++)box(g,[.51,.10,.37],[x+.85,1.12+i*.09,-.95],i%2?'#d9b4ad':'#e9dac3',.045);
 picture(g,x+.76,1.34,back+.09,'rabbit');
 rug(g,x-.4,.185,split-.55,1.3,.55,'#b0c4bf',-.08);
 // A loosely arranged lounge: two nests, yarn basket, books and toy bone.
 rug(g,x,.178,(split+front)/2,2.27,2.1,'#d9aea0',.07);
 bed(g,x-.5,.19,split+.72,'#b3bea0',-.15);bed(g,x+.48,.19,front-.72,'#cab5ad',.24);
 yarn(g,x-.6,.20,front-.65);bone(g,x+.7,.19,split+.65,-.3);
 book(g,x-.95,.20,front-1.42,'#9cacb4',.27);book(g,x-.94,.28,front-1.40,'#dec4a2',-.12);
 plant(g,x+.83,.17,split+.18,.65);
 cylinder(g,.20,.23,.12,[x+.77,.25,front-.17],'#afc5c2');cylinder(g,.16,.16,.012,[x+.77,.315,front-.17],'#bad8d7');
 // Storage nook outside the playable room, with irregular stacks and bags.
 cardboard(g,-w/2-.43,.18,-h/2-.42,.51,-.15);cardboard(g,-w/2-.48,.57,-h/2-.44,.40,.12);shoppingBag(g,-w/2-.40,.18,-h/2+.35);
 return g;
}
