import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/** Future assets must include provenance and a redistribution-compatible license. */
export class Resources {
 private loader=new GLTFLoader();
 async loadGLTF(url:string) { const gltf=await this.loader.loadAsync(url);gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});return gltf; }
 dispose(root:T.Object3D) {
  const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
  root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}if(o instanceof T.Light && 'shadow' in o)(o as T.DirectionalLight).shadow?.dispose();});
  materials.forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});m.dispose();});textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());root.clear();
 }
}
