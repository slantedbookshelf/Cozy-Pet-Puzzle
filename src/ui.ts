import type {GameState} from './game/Game';
import {levels} from './game/levels';
export function createUI(){
 document.querySelector('#app')!.innerHTML=`<main class="puzzle-app">
 <section id="viewport" aria-label="萌宠街区"><div id="loading">正在唤醒小街区…</div></section>
 <header class="level-chip"><span>LEVEL <b id="level-number">01</b></span><small id="moves">0 步</small><small id="par">最优 0</small></header>
 <nav class="tools" aria-label="游戏工具"><button id="levels" aria-label="选择关卡" title="选择关卡">▦</button><button id="undo" aria-label="撤销" title="撤销">↶</button><button id="reset" aria-label="重置本关" title="重置本关">↻</button><button id="show-hint" aria-label="提示下一步" title="提示下一步">?</button><button id="camera-reset" aria-label="复位视角" title="复位视角">⌖</button></nav>
 <p id="hint">方向键 / WASD · 一起滑动，同时到位</p><div id="status" class="sr-only" role="status" aria-live="polite"></div>
 <div class="dpad" aria-label="方向控制"><button data-direction="up" aria-label="向上滑动">↑</button><button data-direction="left" aria-label="向左滑动">←</button><span>·</span><button data-direction="right" aria-label="向右滑动">→</button><button data-direction="down" aria-label="向下滑动">↓</button></div>
 <dialog id="win-dialog" aria-labelledby="win-title"><div class="win-symbol">♡</div><h2 id="win-title">一起开饭啦！</h2><p id="win-copy"></p><div class="win-actions"><button id="next">下一关 →</button><button id="replay-level">再玩一次</button></div></dialog><dialog id="level-dialog" aria-labelledby="level-title"><h2 id="level-title">选择关卡</h2><div id="level-grid" class="level-grid"></div><button id="close-levels">返回街区</button></dialog></main>`;
 const element=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
 const dialog=element<HTMLDialogElement>('win-dialog'),levelDialog=element<HTMLDialogElement>('level-dialog'),abort=new AbortController();
 let hinted=false;try{hinted=sessionStorage.getItem('cozy-hint')==='seen';}catch{}
 dialog.addEventListener('cancel',e=>e.preventDefault(),{signal:abort.signal});
 return {viewport:element('viewport'),render(s:GameState){
 element('level-number').textContent=String(s.index+1).padStart(2,'0');element('moves').textContent=`${s.moves} 步`;element('par').textContent=`最优 ${s.level.solution.length} · 最佳 ${s.best[s.index]??'—'}`;
 if(s.moves>0){hinted=true;try{sessionStorage.setItem('cozy-hint','seen');}catch{}}
 element('hint').hidden=hinted;
 element<HTMLButtonElement>('undo').disabled=!s.canUndo;element<HTMLButtonElement>('reset').disabled=s.phase==='moving'||s.phase==='eating';
 element<HTMLButtonElement>('levels').disabled=s.phase==='moving'||s.phase==='eating';element<HTMLButtonElement>('show-hint').disabled=s.phase!=='ready';
 element('level-grid').replaceChildren(...Array.from({length:s.total},(_,i)=>{const b=document.createElement('button');b.className='level-tile'+(i===s.index?' current':'');b.disabled=i>s.unlocked;b.dataset.level=String(i);const best=s.best[i],stars=best===null?0:best<=levels[i].stars.three?3:best<=levels[i].stars.two?2:1;b.innerHTML=`<strong>${String(i+1).padStart(2,'0')}</strong><span>${i>s.unlocked?'🔒':stars?'★'.repeat(stars):'·'}</span>`;return b;}));
 document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(b=>b.disabled=s.phase!=='ready');
 element('status').textContent=s.phase==='eating'?'全员到位，一起开饭！':s.phase==='won'?'本关完成':`第 ${s.index+1} 关，${s.moves} 步`;
 if(s.phase==='won'){element('win-title').textContent=s.index===s.total-1?'默契满分！':'一起开饭啦！';element('win-copy').textContent=`${'★'.repeat(s.stars)} · ${s.moves} 步 · 最优 ${s.level.solution.length}`;element('next').textContent=s.index===s.total-1?'再来一轮 ↺':'下一关 →';if(!dialog.open)dialog.showModal();}else if(dialog.open)dialog.close();
 },on(id:string,fn:()=>void){element(id).addEventListener('click',fn,{signal:abort.signal});},onLevel(fn:(index:number)=>void){element('level-grid').addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-level]');if(b&&!b.disabled){levelDialog.close();fn(Number(b.dataset.level));}},{signal:abort.signal});},openLevels(){if(!levelDialog.open)levelDialog.showModal();},closeLevels(){if(levelDialog.open)levelDialog.close();},showHint(message:string){const h=element('hint');h.hidden=false;h.textContent=message;},dispose(){abort.abort();if(dialog.open)dialog.close();if(levelDialog.open)levelDialog.close();}};
}
