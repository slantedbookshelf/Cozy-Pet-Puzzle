import * as T from 'three';
export function addLighting(scene:T.Scene) {
 scene.add(new T.HemisphereLight('#fff4dd','#a4b1a2',1.65));
 const sun=new T.DirectionalLight('#ffe7c9',2.6);sun.position.set(-5,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:45});sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;sun.shadow.radius=3;scene.add(sun);
 const fill=new T.DirectionalLight('#dfebf1',.8);fill.position.set(6,6,-3);scene.add(fill);
}
