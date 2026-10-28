import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Bake only opaque static décor. Animated subtrees, textures and transparent contact decals remain separate. */
export function batchStatic(root:T.Group){
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();
 const batches=new Map<string,{geometry:T.BufferGeometry[];meshes:T.Mesh[];roughness:number;cast:boolean;receive:boolean}>();
 root.traverse(o=>{
  if(!(o instanceof T.Mesh)||!(o.material instanceof T.MeshStandardMaterial)||o.material.map||o.material.transparent||o.material.emissiveIntensity&&o.material.emissive.getHex()!==0)return;
  for(let p:T.Object3D|null=o;p&&p!==root;p=p.parent)if(p.userData.dynamic)return;
  // Spatial buckets preserve frustum culling when the district extends beyond the screen.
  const position=new T.Vector3().setFromMatrixPosition(o.matrixWorld).applyMatrix4(inverse);
  const mat=o.material,key=`${Math.floor(position.x/6)}:${Math.floor(position.z/6)}:${mat.roughness}:${o.castShadow}:${o.receiveShadow}`;
  if(!batches.has(key))batches.set(key,{geometry:[],meshes:[],roughness:mat.roughness,cast:o.castShadow,receive:o.receiveShadow});
  const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
  geo.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));
  // Uniform attribute layout permits boxes, spheres, cylinders and curves in the same batch.
  for(const name of Object.keys(geo.attributes))if(name!=='position'&&name!=='normal')geo.deleteAttribute(name);
  const count=geo.getAttribute('position').count,color=new Float32Array(count*3);
  for(let i=0;i<count;i++)mat.color.toArray(color,i*3);geo.setAttribute('color',new T.BufferAttribute(color,3));
  batches.get(key)!.geometry.push(geo);batches.get(key)!.meshes.push(o);
 });
 for(const batch of batches.values()){
  const geometry=mergeGeometries(batch.geometry,false);batch.geometry.forEach(g=>g.dispose());
  if(!geometry)throw new Error('Static diorama batching failed');
  const material=new T.MeshStandardMaterial({vertexColors:true,roughness:batch.roughness});
  const merged=new T.Mesh(geometry,material);merged.castShadow=batch.cast;merged.receiveShadow=batch.receive;merged.name='Static décor batch';
  const oldGeometry=new Set<T.BufferGeometry>(),oldMaterials=new Set<T.Material>();
  for(const mesh of batch.meshes){oldGeometry.add(mesh.geometry);oldMaterials.add(mesh.material as T.Material);mesh.removeFromParent();}
  oldGeometry.forEach(g=>g.dispose());oldMaterials.forEach(m=>m.dispose());root.add(merged);
 }
}
