import * as THREE from 'three';

import { Clock } from 'https://cdn.skypack.dev/three@0.137';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

let camera, scene, renderer;
let controls, water, sun, boat;

const clock = new Clock();

function main() {

    // Loaders
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    document.body.appendChild( renderer.domElement );

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );
    
    // Sun setup
    sun = new THREE.Vector3();

    // Boat setup
    const boatTexture = textureLoader.load('boat_texture.png');
    boatTexture.encoding = THREE.sRGBEncoding;
    const boatMaterial = new THREE.MeshBasicMaterial({ map: boatTexture });
    boatMaterial.needsUpdate = true;

    gltfLoader.load("boat.glb", function (glb) { 
        boat = glb.scene; 
        boat.children[0].material = boatMaterial;
        boat.scale.set(30, 30, 30);

        scene.add(boat);
        console.log (boat);
    });

    // Water setup
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'water.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    // Rotate water plane
    water.rotation.x = - Math.PI / 2;

    scene.add( water );

    // Skybox setup
    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const sceneEnv = new THREE.Scene();

    let renderTarget;

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        sceneEnv.add( sky );
        renderTarget = pmremGenerator.fromScene( sceneEnv );
        scene.add( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

    // Controls setup
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    const waterUniforms = water.material.uniforms;

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

function render() {
    let time = clock.getElapsedTime();

    if (boat){
        boat.position.y = Math.sin(time) * 0.5-3;   
        boat.rotation.x = Math.sin(time) * 0.03;
        boat.rotation.z = Math.cos(time) * 0.03; 
    }
    
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    renderer.render( scene, camera );
    
    requestAnimationFrame(render);
}

main();