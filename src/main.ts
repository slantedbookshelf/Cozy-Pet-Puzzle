import './style.css';
import {createUI} from './ui';
import {Game} from './game/Game';
import {SceneManager} from './render/SceneManager';
import {InputManager} from './core/InputManager';
const ui=createUI();
let scene:SceneManager|undefined;
try{
 scene=new SceneManager(ui.viewport);
 const game=new Game(scene,state=>ui.render(state));
 const input=new InputManager(direction=>{void game.move(direction);});
 ui.on('undo',()=>game.undo());ui.on('reset',()=>game.reset());ui.on('replay-level',()=>game.reset());
 ui.on('next',()=>{if(game.state.index===game.state.total-1)game.replay();else game.next();});
 ui.on('camera-reset',()=>scene?.resetCamera());
 document.querySelector('#loading')?.remove();
 let disposed=false;
 const dispose=()=>{if(disposed)return;disposed=true;game.dispose();input.dispose();scene?.dispose();ui.dispose();};
 if(import.meta.hot)import.meta.hot.dispose(dispose);
 window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();},{once:true});
}catch(error){scene?.dispose();console.error(error);document.querySelector('#loading')!.textContent='小店暂时无法打开，请开启浏览器硬件加速后刷新。';}
