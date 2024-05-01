import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM elements
const b1 = document.getElementById("b1");
const range1 = document.getElementById('range1');
const range2 = document.getElementById('range2');

let camera, scene, renderer;
let ball;

// Camera movement variables
let moveForward = 0;
let moveSideward = 0;
let moveUpward = 0;

// Pause status
let isPause = true;

// Click event handlers
b1.onclick = () => togglePause();

function main() {
    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Renderer setup
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, canvas);
    camera.position.set(0, 0.5, 2);

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    scene.fog = new THREE.Fog(0x333333, 5, 15);

    // Volleyball texture
    const volleyball_tex = textureLoader.load('volleyball.jpg');
    
    // Sphere setup
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshPhongMaterial({ map: volleyball_tex });
    ball = new THREE.Mesh(geometry, material);
    ball.position.y = 0.5;
    scene.add(ball);

    // Grid setup
    const grid = new THREE.GridHelper(50, 50, 0xffffff, 0xffffff);
    grid.material.opacity = 0.2;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add(grid);

    // Light setup
    const light = new THREE.AmbientLight(0xFFFFFF, 5);
    light.position.set(0, 4, 0);
    scene.add(light);

    // Add Window resize listener
    window.addEventListener( 'resize', onWindowResize );

    //Start animating
    requestAnimationFrame(render);
}

function togglePause() {
    isPause = !isPause;
    b1.textContent = isPause ? "Start" : "Pause";
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render(time) {
    time *= 0.001;

    if (!isPause && ball) {
        ball.rotation.x = time;
        ball.rotation.y = time;

        ball.position.y = 0.5 + Math.abs(Math.sin(time * range2.value)) * range1.value;
        ball.position.z = Math.cos(time) * 4;

        camera.position.z += -moveForward * 0.01;
        camera.position.x += -moveSideward * 0.01;
        camera.position.y += moveUpward * 0.01;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

main();
