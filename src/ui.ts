import type {GameState} from './game/Game';
export function createUI(){
 document.querySelector('#app')!.innerHTML=`<main class="puzzle-app">
 <section id="viewport" aria-label="萌宠街区"><div id="loading">正在唤醒小街区…</div></section>
 <header class="level-chip"><span>LEVEL <b id="level-number">01</b></span><small id="moves">0 步</small></header>
 <nav class="tools" aria-label="游戏工具"><button id="undo" aria-label="撤销" title="撤销">↶</button><button id="reset" aria-label="重置本关" title="重置本关">↻</button><button id="camera-reset" aria-label="复位视角" title="复位视角">⌖</button></nav>
 <p id="hint">方向键 / WASD · 一起滑动，同时到位</p><div id="status" class="sr-only" role="status" aria-live="polite"></div>
 <div class="dpad" aria-label="方向控制"><button data-direction="up" aria-label="向上滑动">↑</button><button data-direction="left" aria-label="向左滑动">←</button><span>·</span><button data-direction="right" aria-label="向右滑动">→</button><button data-direction="down" aria-label="向下滑动">↓</button></div>
 <dialog id="win-dialog" aria-labelledby="win-title"><div class="win-symbol">♡</div><h2 id="win-title">一起开饭啦！</h2><p id="win-copy"></p><div class="win-actions"><button id="next">下一关 →</button><button id="replay-level">再玩一次</button></div></dialog></main>`;
 const element=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
 const dialog=element<HTMLDialogElement>('win-dialog'),abort=new AbortController();
 let hinted=false;try{hinted=sessionStorage.getItem('cozy-hint')==='seen';}catch{}
 dialog.addEventListener('cancel',e=>e.preventDefault(),{signal:abort.signal});
 return {viewport:element('viewport'),render(s:GameState){
 element('level-number').textContent=String(s.index+1).padStart(2,'0');element('moves').textContent=`${s.moves} 步`;
 if(s.moves>0){hinted=true;try{sessionStorage.setItem('cozy-hint','seen');}catch{}}
 element('hint').hidden=hinted;
 element<HTMLButtonElement>('undo').disabled=!s.canUndo;element<HTMLButtonElement>('reset').disabled=s.phase==='moving'||s.phase==='eating';
 document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(b=>b.disabled=s.phase!=='ready');
 element('status').textContent=s.phase==='eating'?'全员到位，一起开饭！':s.phase==='won'?'本关完成':`第 ${s.index+1} 关，${s.moves} 步`;
 if(s.phase==='won'){element('win-title').textContent=s.index===s.total-1?'默契满分！':'一起开饭啦！';element('win-copy').textContent=`${s.moves} 步，让每位伙伴都吃到了美味。`;element('next').textContent=s.index===s.total-1?'再来一轮 ↺':'下一关 →';if(!dialog.open)dialog.showModal();}else if(dialog.open)dialog.close();
 },on(id:string,fn:()=>void){element(id).addEventListener('click',fn,{signal:abort.signal});},dispose(){abort.abort();if(dialog.open)dialog.close();}};
}
