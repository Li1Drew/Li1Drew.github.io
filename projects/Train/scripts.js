import { Clock, Vector3 } from 'https://cdn.skypack.dev/three@0.137';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';

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
    const skyTexture = textureLoader.load('sky_map.jpg');
    skyTexture.mapping = THREE.EquirectangularReflectionMapping;
    skyTexture.colorSpace = THREE.SRGBColorSpace;

    // Background
    scene.background = skyTexture;

    // Points
    const initialPoints = [
        { x: 3, y: 0, z: - 3 },
        { x: 3, y: 0, z: 3 },
        { x: - 3, y: 0, z: 3 },
        { x: - 3, y: 0, z: - 3 },
    ];
    const curveHandles = [];
    let flow;

    const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x44ff00});

    for ( const handlePos of initialPoints ) {

        const handle = new THREE.Mesh( boxGeometry, boxMaterial );
        handle.position.copy( handlePos );
        curveHandles.push( handle );
        scene.add( handle );

    }

    const curve = new THREE.CatmullRomCurve3(
        curveHandles.map( ( handle ) => handle.position )
    );
    curve.curveType = 'centripetal';
    curve.closed = true;

    const points = curve.getPoints( 50 );
    const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints( points ),
        new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    );

    let train;
    gltfLoader.load("train.glb", function (glb) { 
        train = glb.scene;

        flow = new Flow( train );
        flow.updateCurve( 0, curve );
        scene.add( flow.object3D );
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
    ambientLight.position.set(0, 4, 0);
    scene.add(ambientLight);

    // Render function
    function render(time) {
        const delta = clock.getDelta();

        if ( flow ) {
            flow.moveAlongCurve( 0.001 );
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Start rendering
    requestAnimationFrame(render);
}

// Call main function
main();
