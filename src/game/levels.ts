import type { Level } from './types';
import generated from '../../generated-levels.json';
const original = [
  {id:1,title:'第一口小鱼干',lesson:'每次都会滑到底。试着借助边界，停在小鱼干前的薄荷色目标格上。',width:4,height:4,
   animals:[{id:'cat',species:'cat',position:{x:0,y:3}}],obstacles:[],
   targets:[{animalId:'cat',position:{x:3,y:0},food:{x:3,y:-1}}],solution:['up','right']},
  {id:2,title:'刚刚好的停靠',lesson:'花箱也是刹车。利用障碍改变停靠位置，找到柜台前的那一格。',width:5,height:5,
   animals:[{id:'cat',species:'cat',position:{x:0,y:4}}],obstacles:[{x:0,y:1},{x:3,y:2}],
   targets:[{animalId:'cat',position:{x:2,y:0},food:{x:2,y:-1}}],solution:['up','right','up']},
  {id:3,title:'一起开饭吧',lesson:'栗子和布丁会一起滑动，也会挡住彼此。必须同时就位，才能一起开饭。',width:5,height:5,
   animals:[{id:'cat',species:'cat',position:{x:0,y:4}},{id:'dog',species:'dog',position:{x:4,y:4}}],obstacles:[{x:0,y:1},{x:3,y:2},{x:1,y:3}],
   targets:[{animalId:'cat',position:{x:4,y:0},food:{x:4,y:-1}},{animalId:'dog',position:{x:3,y:0},food:{x:3,y:-1}}],solution:['right','up','left','up','right']},
];
const names=['双人靠岸','错位的脚步','绕过花箱','三位客人','排成一列','换个方向','角落里的线索','纸箱小径','先退一步','分头停靠','收拢队形','柜台回环','交错的路线','储物格','错身而过','花架迷宫','远路近餐','侧门转弯','重新排队','木箱阵列','逆向出发','双重转位','曲折归途','最后一格','静心推演','默契考验','街区大师'];
export const levels: readonly Level[] = [...original,...generated.map((level,i)=>({...level,title:names[i],lesson:'观察每只宠物的停靠点，调整队形后让大家同时到位。'}))].map(level=>{
 const n=level.solution.length;
 return {...level,difficulty:level.id<=3?1:level.id<=6?2:level.id<=9?3:level.id<=15?4:5,stars:{three:n,two:n+Math.max(2,Math.ceil(n*(level.id<=9?.4:.25)))}} as Level;
});
