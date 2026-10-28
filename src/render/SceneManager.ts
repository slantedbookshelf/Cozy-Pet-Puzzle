import * as T from 'three';
import {createCamera} from '../core/camera';
import {Resources} from '../core/resources';
import {addLighting} from '../world/lighting';
import {boardPoint} from './boardScene';
import {buildDiorama} from './environment/Diorama';
import {AnimalRenderer} from './AnimalRenderer';
import type {GameView} from '../game/Game';
import type {Animal,Direction,Level,Move} from '../game/types';
export class SceneManager implements GameView {
 private renderer=new T.WebGLRenderer({antialias:true,alpha:true});
 private scene=new T.Scene();private resources=new Resources();private contents=new T.Group();private animals?:AnimalRenderer;
 private cameraRig=createCamera(this.renderer.domElement);private observer:ResizeObserver;private elapsed=0;private last=0;
 private environment?:ReturnType<typeof buildDiorama>;
 constructor(private viewport:HTMLElement){
  const r=this.renderer;r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=.97;viewport.appendChild(r.domElement);r.domElement.setAttribute('aria-label','三维棋盘：方向键控制所有动物，拖动仅调整视角');
  this.cameraRig.controls.target.set(0,.3,0);this.cameraRig.controls.update();this.cameraRig.controls.saveState();
  addLighting(this.scene);this.scene.add(this.contents);
  const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.10}));ground.rotation.x=-Math.PI/2;ground.position.y=-.56;ground.receiveShadow=true;this.scene.add(ground);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(viewport);this.resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  r.setAnimationLoop(ms=>{const dt=Math.min((ms-this.last)/1000,.05);this.last=ms;if(document.hidden)return;this.elapsed+=dt;this.animals?.update(this.elapsed,dt,reduced.matches);this.environment?.update(this.elapsed,reduced.matches);this.cameraRig.controls.update();r.render(this.scene,this.cameraRig.camera);if(import.meta.env.DEV){this.viewport.dataset.drawCalls=String(r.info.render.calls);this.viewport.dataset.triangles=String(r.info.render.triangles);this.viewport.dataset.geometries=String(r.info.memory.geometries);}});
 }
 private resize(){const w=this.viewport.clientWidth,h=this.viewport.clientHeight;this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setSize(w,h);this.cameraRig.resize(w,h);}
 load(level:Level,animals:readonly Animal[]){this.animals?.cancel();this.resources.dispose(this.contents);this.environment=buildDiorama(level);this.contents.add(this.environment.root);this.animals=new AnimalRenderer(animals,p=>boardPoint(level,p),level.targets);this.contents.add(this.animals.group);this.cameraRig.controls.reset();}
 sync(animals:readonly Animal[]){this.animals!.sync(animals);}
 animate(moves:readonly Move[],direction:Direction){return this.animals!.animate(moves,direction);}
 celebrate(){return this.animals!.celebrate();}
 resetCamera(){this.cameraRig.controls.reset();}
 dispose(){this.renderer.setAnimationLoop(null);this.animals?.cancel();this.observer.disconnect();this.cameraRig.controls.dispose();this.resources.dispose(this.scene);this.renderer.dispose();this.renderer.domElement.remove();}
}

