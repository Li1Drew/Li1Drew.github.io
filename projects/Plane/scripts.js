import * as THREE from 'three';
import { Clock, Vector3 } from 'https://cdn.skypack.dev/three@0.137';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let airplane, rot, rad, randomAxis, randomAxisRot;

// Clock
const clock = new Clock();

// Random number generator
function getRandomNumber() {
    return Math.random() * 2 - 1;
}

// Main function
function main() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);

    // Renderer setup
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Controls setup
    const controls = new OrbitControls(camera, canvas);

    // Loaders setup
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    // Textures setup
    const spaceTexture = textureLoader.load('stars_map.jpg');
    const earthTexture = textureLoader.load('earth_color.jpg');
    spaceTexture.mapping = THREE.EquirectangularReflectionMapping;
    spaceTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials setup
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });

    // Background setup
    scene.background = spaceTexture;

    // Earth setup
    const earthGeometry = new THREE.SphereGeometry(1);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Airplane setup
    gltfLoader.load("Plane_Main.glb", function (glb) { 
        airplane = glb.scene;
        airplane.scale.set(.02, .02, .02);

        scene.add(airplane);
    });

    // Lights setup
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
    ambientLight.position.set(0, 4, 0);
    scene.add(ambientLight);

    // Animation parameters setup
    rot = Math.PI * 2;
    rad = Math.random() * Math.PI * 0.45 + Math.PI * 0.05;
    randomAxis = new Vector3(getRandomNumber(), getRandomNumber(), getRandomNumber()).normalize();
    randomAxisRot = Math.random() * Math.PI * 2;

    // Add Window resize listener
    window.addEventListener( 'resize', onWindowResize );

    //Start animating
    requestAnimationFrame(render);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Render function
function render() {
    const delta = clock.getDelta();

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

main();
