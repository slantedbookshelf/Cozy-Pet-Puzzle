import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export function createCamera(canvas:HTMLCanvasElement) {
 const camera=new T.OrthographicCamera(-8,8,6,-6,.1,80);camera.position.set(9,14,18);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,.3,0);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minPolarAngle=.76;controls.maxPolarAngle=.88;controls.minAzimuthAngle=.34;controls.maxAzimuthAngle=.54;controls.minZoom=.9;controls.maxZoom=1.08;controls.rotateSpeed=.35;controls.zoomSpeed=.6;controls.update();controls.saveState();
 function resize(w:number,h:number) {const aspect=w/h;const span=Math.max(10.8,10/aspect);camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();}
 return {camera,controls,resize};
}
