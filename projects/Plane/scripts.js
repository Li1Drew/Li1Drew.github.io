import { Clock, Vector3 } from 'https://cdn.skypack.dev/three@0.137';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Clock
const clock = new Clock();

// Random number generator
function getRandomNumber() {
    return Math.random() * 2 - 1;
}

// Main function
function main() {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const fov = 75;
    const aspect = sizes.width / sizes.height;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);

    // Renderer setup
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, canvas });
    renderer.setSize(sizes.width, sizes.height);

    // Orbit controls setup
    const controls = new OrbitControls(camera, canvas);

    // Loaders
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    // Textures
    const spaceTexture = textureLoader.load('stars_map.jpg');
    const earthTexture = textureLoader.load('earth_color.jpg');
    const planeTexture = textureLoader.load('Plane_Body.png');
    spaceTexture.mapping = THREE.EquirectangularReflectionMapping;
    spaceTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const planeMaterial = new THREE.MeshPhongMaterial({ map: planeTexture });

    // Background
    scene.background = spaceTexture;

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Airplane
    let airplane;
    gltfLoader.load("Plane_Main.glb", function (glb) { 
        airplane = glb.scene;
        airplane.scale.set(.02, .02, .02);

        scene.add(airplane);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
    ambientLight.position.set(0, 4, 0);
    scene.add(ambientLight);

    // Animation parameters
    let rot = Math.PI * 2;
    let rad = Math.random() * Math.PI * 0.45 + Math.PI * 0.05;
    let randomAxis = new Vector3(getRandomNumber(), getRandomNumber(), getRandomNumber()).normalize();
    let randomAxisRot = Math.random() * Math.PI * 2;

    // Render function
    function render(time) {
        const delta = clock.getDelta();
        time *= 0.001;

        if (airplane) {
            airplane.position.set(0, 0, 0);
            airplane.rotation.set(0, 0, 0);
            airplane.updateMatrixWorld();
            rot += delta * 0.5;
            airplane.rotateOnAxis(randomAxis, randomAxisRot);
            airplane.rotateOnAxis(new Vector3(0, 1, 0), rot);
            airplane.rotateOnAxis(new Vector3(0, 0, 1), rad);
            airplane.translateY(1.1);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Start rendering
    requestAnimationFrame(render);
}

// Call main function
main();
