import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// @ts-ignore
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
// @ts-ignore
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// @ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// @ts-ignore
import Stats from "three/addons/libs/stats.module.js";

import { PAGE_PADDING } from "./constants";

export let mixer: any;

export function initThree() {
  const clock = new THREE.Clock();

  const container = document.getElementById("skecth-container");

  const camera = new THREE.PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    1,
    20
  );
  camera.position.set(-5, 0, 10);

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    window.innerWidth - PAGE_PADDING * 2,
    window.innerHeight - PAGE_PADDING - 136
  );

  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  container?.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xff0000, 3, 5);
  light.position.set(-1, 1, 2);
  scene.add(light);

  const light2 = new THREE.AmbientLight(0xffffff, 1); // soft white light
  scene.add(light2);

  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    "wiz_nolight.fbx",
    (object) => {
      object.scale.set(0.01, 0.01, 0.01);

      console.log(object);

      const mesh = object.children.find(({ type }) => type === "SkinnedMesh");
      const head = mesh?.getObjectByName("neutral") as THREE.SkinnedMesh;
      // @ts-ignore
      const influences = mesh?.morphTargetInfluences;

      const gui = new GUI();
      gui.close();

      mixer = new THREE.AnimationMixer(object);
      // @ts-ignore
      for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
        console.log(key, value);
        gui
          .add(influences, value, 0, 1, 0.01)
          .name(key.replace("blendShape1.", ""))
          .listen(influences);
      }

      scene.add(object);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );

  const environment = new RoomEnvironment();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0x222222);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0.5;
  controls.maxDistance = 5;
  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 1.8;
  // controls.target.set(0, 1, 0);

  const stats = new Stats();
  container?.appendChild(stats.dom);

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
