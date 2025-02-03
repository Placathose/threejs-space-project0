import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 1. This is where we set the scene

const scene = new THREE.Scene();

// argument: (field of view, aspect ratio, view frustrum)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Rendering the scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );

// set camera position along Z and X
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// 2. Adding shape 
// const geometry = new THREE.TorusGeometry(10, 2, 12, 48);
const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 

// MeshBasicMaterial require no light source
// MeshStandardMaterial need a light source
const material = new THREE.MeshStandardMaterial({color: 0xFF6347})
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// 3. Adding lights
const pointLight = new THREE.PointLight(0xffffff, 110, 100 );
pointLight.position.set(2, 2, 5)

const ambientLight = new THREE.AmbientLight(0x1f1d1d, 5, 50 )
scene.add(pointLight, ambientLight);

// 4. Helpers (Things to help you visualize better the scene)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


// 5. Generate random stars around
function addStar() {
  // Create a sphere
  const geometry = new THREE.SphereGeometry(0.25, 24,24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  // Create the star
  const star = new THREE.Mesh( geometry, material );

  // Generate random x,y,z position
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  // Add star to the scene
  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)


// 6. Loading space texture image
const spaceTexture = new THREE.TextureLoader().load('space-img.jpeg');
scene.background = spaceTexture;


// 7. Texture Mapping 
const trippyTexture = new THREE.TextureLoader().load('trippy-img.jpeg');

const trippyCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: trippyTexture })
);

// scene.add(trippyCube);

// 8. Texture Mapping on sphere
const marsTexture = new THREE.TextureLoader('Mars-texture.jpeg')
const normalTexture = new THREE.TextureLoader('normal.jpg')

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: marsTexture})
)

scene.add(mars)

// Call render.render() only once
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // moon.rotation.x += 0.005;

  controls.update();

  renderer.render(scene, camera);
}

animate();