// === Sahne kurulumu ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// === Işıklar ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);

// === Zemin ===
const planeGeo = new THREE.PlaneGeometry(200, 200);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(planeGeo, planeMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === Oyuncu (küre veya kutu) ===
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
player.castShadow = true;
player.position.set(0, 0.5, 0);
scene.add(player);

// === Kamera pozisyonu ===
camera.position.set(0, 5, 10);
camera.lookAt(player.position);

// === Joystick ayarı ===
let moveX = 0;
let moveZ = 0;

const joystick = nipplejs.create({
  zone: document.getElementById("joystickZone"),
  mode: "static",
  position: { left: "75px", bottom: "75px" },
  color: "white"
});

joystick.on("move", (evt, data) => {
  const angle = data.angle.radian;
  moveX = Math.cos(angle) * 0.2;
  moveZ = Math.sin(angle) * 0.2;
});

joystick.on("end", () => {
  moveX = 0;
  moveZ = 0;
});

// === Model Yükleme (hazırlık, dosya yoksa küp kullanılır) ===
const loader = new THREE.GLTFLoader();
let modelLoaded = false;

loader.load("player.glb", (gltf) => {
  scene.remove(player);
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.copy(player.position);
  model.castShadow = true;
  scene.add(model);
  player.model = model;
  modelLoaded = true;
}, undefined, (error) => {
  console.error("Model yüklenemedi:", error);
});

// === Oyun döngüsü ===
function animate() {
  requestAnimationFrame(animate);

  // Oyuncuyu hareket ettir
  player.position.x += moveX;
  player.position.z += moveZ;

  // Eğer model yüklüyse onu da hareket ettir
  if (modelLoaded && player.model) {
    player.model.position.copy(player.position);
  }

  // Kamera oyuncuyu takip eder
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

animate();
