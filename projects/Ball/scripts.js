import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM elements
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const range1 = document.getElementById('range1');
const range2 = document.getElementById('range2');

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let Timer = 0;
let prevTime = 0;
let deltaTime = 0;

// Camera movement variables
let moveForward = 0;
let moveSideward = 0;
let moveUpward = 0;

// Pause status
let isPause = true;

// Click event handlers
b2.onclick = () => togglePause();

function togglePause() {
    // Toggle pause status
    isPause = !isPause;
    if (isPause) {
        b2.textContent = "Start";
        b2.classList.remove("cursor");
    } else {
        b2.textContent = "Pause";
        b2.classList.add("cursor");
    }
}

function main() {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, canvas });
    renderer.setSize(sizes.width, sizes.height);

    const fov = 75;
    const aspect = sizes.width / sizes.height;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, canvas);
    camera.position.z = 2;
    camera.position.y = .5;

    const volleyball_tex = textureLoader.load('volleyball.jpg');
    
    const scene1 = new THREE.Scene();
    scene1.background = new THREE.Color( 0x333333 );
    const fogColor = 0x333333;
    const nearDistance = 5;
    const farDistance = 15;
    scene1.fog = new THREE.Fog(fogColor, nearDistance, farDistance);

    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshPhongMaterial({ map: volleyball_tex });
    const ball = new THREE.Mesh(geometry, material);

    let grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
    grid.material.opacity = 0.2;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene1.add(grid);

    const axesHelper = new THREE.AxesHelper(10);
    scene1.add(axesHelper);

    scene1.add(ball);
    ball.position.y += 0.5;

    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.AmbientLight(color, intensity);
    light.castShadow = true;
    light.position.set(0, 4, 0);
    scene1.add(light);

    function render(time) {
        time *= 0.001;

        deltaTime = time - prevTime;
        Timer += deltaTime;
        b1.textContent = "Timer: " + Math.floor(Timer);

        if (!isPause) {
            ball.rotation.x = time;
            ball.rotation.y = time;

            ball.position.y = 0.5 + Math.abs(Math.sin(time * range2.value)) * range1.value;
            ball.position.z = Math.cos(time) * 4;

            camera.position.z += -moveForward * 0.01;
            camera.position.x += -moveSideward * 0.01;
            camera.position.y += moveUpward * 0.01;
        }

        renderer.render(scene1, camera);

        prevTime = time;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();