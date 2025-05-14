const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Küp (test modeli)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Işık
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();// Oyuncu Küpü
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.y = 0.5; // yere koy

// Hareket Değişkenleri
let moveX = 0;
let moveY = 0;

// Joystick Başlat
const joystick = nipplejs.create({
  zone: document.getElementById('joystickZone'),
  mode: 'static',
  position: { left: '50px', bottom: '50px' },
  color: 'white'
});

joystick.on('move', (evt, data) => {
  const angle = data.angle.degree;
  const force = data.force;

  // X, Z eksenine dönüştür
  const rad = angle * (Math.PI / 180);
  moveX = Math.cos(rad) * force * 0.05;
  moveY = Math.sin(rad) * force * 0.05;
});

joystick.on('end', () => {
  moveX = 0;
  moveY = 0;
});

// Animasyon Döngüsünde Oyuncuyu Hareket Ettir
function animate() {
  requestAnimationFrame(animate);

  player.position.x += moveX;
  player.position.z += moveY;

  renderer.render(scene, camera);
}
animate();
