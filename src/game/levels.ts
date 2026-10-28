import type { Level } from './types';
export const levels: readonly Level[] = [
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
