import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

// Renderer ve sahne ayarları
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // gökyüzü rengi

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#gameCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Işık
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Zemin
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Oyuncu modeli yükleyici
const loader = new GLTFLoader();
let player;
loader.load('assets/models/player.glb', function (gltf) {
  player = gltf.scene;
  player.scale.set(1, 1, 1);
  player.position.set(0, 0, 0);
  scene.add(player);
}, undefined, function (error) {
  console.error('Model yüklenemedi:', error);
});

// Kamera kontrolü
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// Render döngüsü
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
