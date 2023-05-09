"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
// @ts-ignore
import Stats from "three/addons/libs/stats.module.js";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// @ts-ignore
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
// @ts-ignore
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
// @ts-ignore
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
// @ts-ignore
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export let mixer: any;

export function initThree() {
  const clock = new THREE.Clock();

  const zeroTrack = new THREE.NumberKeyframeTrack(
    "mesh_2.morphTargetInfluences",
    [0, 1],
    Array.from({ length: 104 }, () => 0)
  );
  let zeroClip = new THREE.AnimationClip("blink", -1, [zeroTrack]);

  const container = document.createElement("div");
  document.body.appendChild(container);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    20
  );
  camera.position.set(-1.8, 0.8, 3);

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  container.appendChild(renderer.domElement);

  const ktx2Loader = new KTX2Loader()
    .setTranscoderPath("/textures/basis/")
    .detectSupport(renderer);

  new GLTFLoader()
    .setKTX2Loader(ktx2Loader)
    .setMeshoptDecoder(MeshoptDecoder)
    .load("/facecap.glb", (gltf: any) => {
      console.log("gltf", gltf);

      const mesh = gltf.scene.children[0];
      scene.add(mesh);
      console.log("mesh", mesh);

      mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(zeroClip).play();
      // GUI

      const head = mesh.getObjectByName("mesh_2");
      const influences = head.morphTargetInfluences;

      const gui = new GUI();
      gui.close();

      for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
        console.log(key, value);
        gui
          .add(influences, value, 0, 1, 0.01)
          .name(key.replace("blendShape1.", ""))
          .listen(influences);
      }
    });

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0x666666);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 5;
  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 1.8;
  controls.target.set(0, 0.15, -0.2);

  const stats = new Stats();
  container.appendChild(stats.dom);

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }

    renderer.render(scene, camera);

    controls.update();

    stats.update();
  });
}
