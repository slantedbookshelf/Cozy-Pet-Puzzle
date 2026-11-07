import {build} from 'esbuild';
import {writeFile,unlink} from 'node:fs/promises';
await build({entryPoints:['src/game/solver.ts'],outfile:'.tmp-solver.mjs',bundle:true,platform:'node',format:'esm'});
const {solve}=await import('./.tmp-solver.mjs');
let seed=97031;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const pick=a=>a[Math.floor(rand()*a.length)];
const cells=Array.from({length:25},(_,i)=>({x:i%5,y:Math.floor(i/5)}));
const key=p=>`${p.x},${p.y}`;
const old=[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
const wanted=old.map((_,i)=>i<3?[2,5]:i<6?[4,8]:i<12?[6,11]:i<17?[8,14]:[10,22]);
const selected=[];const signatures=new Set();
for(let n=0;n<30000&&selected.length<27;n++){
 const i=selected.length,count=i<3?2:3,range=wanted[i];
 const obstacleCount=i<3?Math.floor(rand()*2)+1:Math.floor(rand()*4)+2;
 const obstacles=[];while(obstacles.length<obstacleCount){const p=pick(cells);if(!obstacles.some(q=>key(q)===key(p)))obstacles.push(p);}
 const free=cells.filter(p=>!obstacles.some(q=>key(p)===key(q)));
 const edges=free.filter(p=>p.y===0||p.y===4||p.x===0||p.x===4);
 const goals=[];while(goals.length<count){const p=pick(edges);if(!goals.some(q=>key(q)===key(p)))goals.push(p);}
 const starts=[];while(starts.length<count){const p=pick(free);if(!starts.some(q=>key(q)===key(p))&&!goals.some(q=>key(q)===key(p)))starts.push(p);}
 const ids=['cat','dog','rabbit'].slice(0,count);
 const targets=goals.map((p,j)=>({animalId:ids[j],position:p,food:p.y===0?{x:p.x,y:-1}:p.y===4?{x:p.x,y:5}:p.x===0?{x:-1,y:p.y}:{x:5,y:p.y}}));
 const level={id:i+4,title:'',lesson:'',width:5,height:5,animals:starts.map((p,j)=>({id:ids[j],species:ids[j],position:p})),obstacles,targets};
 const solution=solve(level);if(!solution||solution.length<range[0]||solution.length>range[1])continue;
 const sig=[obstacles.map(key).sort().join(';'),goals.map(key).join(';'),solution.join(',')].join('|');if(signatures.has(sig))continue;
 signatures.add(sig);selected.push({...level,solution});console.log(selected.length+3,solution.length,n);
}
await writeFile('generated-levels.json',JSON.stringify(selected,null,2));await unlink('.tmp-solver.mjs');
