import type {Direction} from '../game/types';
export class InputManager {
  private abort=new AbortController();
  constructor(onDirection:(direction:Direction)=>void){
    const keys:Record<string,Direction>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
    window.addEventListener('keydown',e=>{
      if(e.ctrlKey||e.metaKey||e.altKey||(e.target instanceof HTMLElement && (e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))))return;
      const direction=keys[e.key];if(!direction)return;e.preventDefault();if(!e.repeat)onDirection(direction);
    },{signal:this.abort.signal});
    document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(button=>button.addEventListener('click',()=>onDirection(button.dataset.direction as Direction),{signal:this.abort.signal}));
  }
  dispose(){this.abort.abort();}
}
