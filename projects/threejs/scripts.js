import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}    
let aspect;

let b1 = document.getElementById("b1");
let b2 = document.getElementById("b2");
let b3 = document.getElementById("b3");

let Timer = 0;
let prevTime = 0;
let deltaTime = 0;

let SelectScene1 = true;
let SelectScene2 = false; 
let SelectScene3 = false;

let prevDeltaMouseX = 0;
let prevDeltaMouseY = 0;
let deltaMouseX = 0;
let deltaMouseY = 0;

let mouseisDown = false;

let isPause = true;

let moveForward = 0;
let moveSideward = 0;
let moveUpward = 0;

function selectScene1(){ 
    SelectScene1 = true;
    SelectScene2 = false; 
    SelectScene3 = false;
    console.log("Scene 1 selectd");
}

function selectScene2(){
    SelectScene1 = false;
    SelectScene2 = true; 
    SelectScene3 = false;
    console.log("Scene 2 selectd");
}

function selectScene3(){
    SelectScene1 = false;
    SelectScene2 = false; 
    SelectScene3 = true;
    console.log("Scene 3 selectd");
}

function deltaMouse(event){
    deltaMouseX = event.movementX;
    deltaMouseY = event.movementY;
    //console.log("X: " + deltaMouseX + " Y: " + deltaMouseY);
}

function mouseDown(){
    mouseisDown = true;
}

function mouseUp(){
    mouseisDown = false;
}

function keyDown(event){
    if(event.keyCode == 87){
        moveForward = 1;
    } 
    else if(event.keyCode == 83){
        moveForward = -1;
    }
    else if(event.keyCode == 65){
        moveSideward = 1;
    }
    else if(event.keyCode == 68){
        moveSideward = -1;
    }
    else if(event.keyCode == 32){
        moveUpward = 1;
    }
    else if(event.keyCode == 16){
        moveUpward = -1;
    }
}

function keyUp(event){
    if(event.keyCode == 87 || event.keyCode == 83){
        moveForward = 0;
    }
    else if(event.keyCode == 65 || event.keyCode == 68){
        moveSideward = 0;
    }
    else if(event.keyCode == 32 || event.keyCode == 16){
        moveUpward = 0;
    }
    else if(event.keyCode == 27){
        if(isPause === true){
            isPause = false;
            b2.textContent = "no Pause";
            b2.classList.add("cursor");
        } else {
            isPause = true;
            b2.textContent = "Pause";    
            b2.classList.remove("cursor");
        }
    }
}

b1.onclick = function() {selectScene1()};
b2.onclick = function() {selectScene2()};
b3.onclick = function() {selectScene3()};

document.addEventListener("mousemove", deltaMouse);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({alpha: false, antialias: true, canvas});
    renderer.setSize(sizes.width,sizes.height);
    const fov = 75;
    aspect = sizes.width / sizes.height;  // the canvas default
    const near = 0.1;
    const far = 100;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls(camera, canvas);
    camera.position.z = 2;
    
    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const scene3 = new THREE.Scene();
    
    const sky_tex = new THREE.TextureLoader().load('sky.jpg');
    sky_tex.mapping = THREE.EquirectangularReflectionMapping;
    sky_tex.colorSpace = THREE.SRGBColorSpace;

    scene1.background = sky_tex;
    scene2.background = sky_tex;
    scene3.background = sky_tex;
    

    const geometry1 = new THREE.SphereGeometry(0.5);
    const geometry2 = new THREE.BoxGeometry(1, 2, 1);
    const geometry3 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material1 = new THREE.MeshPhongMaterial({color: 0x336688});
    const material2 = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const material3 = new THREE.MeshPhongMaterial({color: 0x44aa00});
    const cube1 = new THREE.Mesh(geometry1, material1);
    const cube2 = new THREE.Mesh(geometry2, material2);
    const cube3 = new THREE.Mesh(geometry3, material3);
    scene1.add(cube1);
    scene2.add(cube2);
    scene3.add(cube3);
    const color = 0xFFFFFF;
    const intensity = 6;
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(-2, 4, 4);
    scene1.add(light1);
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-2, 4, 4);
    scene2.add(light2);
    const light3 = new THREE.DirectionalLight(color, intensity);
    light3.position.set(-3, 4, 4);
    scene3.add(light3);

    function render(time) {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        aspect = sizes.width / sizes.height;
        renderer.setSize(sizes.width,sizes.height);
        camera.updateProjectionMatrix();
        time *= 0.001;  // convert time to seconds

        deltaTime = time - prevTime;
        Timer += deltaTime;
        b1.textContent = "Timer: " + Math.floor(Timer);
        //ball.rotation.y = time*2;
       
        if(mouseisDown == true){
            //cube1.position.x += deltaMouseX * 0.005;
            //cube1.position.y += -deltaMouseY * 0.005;
        }

        cube1.rotation.x = time;
        cube1.rotation.y = time;

        if(isPause === false){
            //camera.rotation.x += -deltaMouseY * 0.001;
            //camera.rotation.y += -deltaMouseX * 0.001;
    
            
            camera.position.z += -moveForward * 0.01;
            camera.position.x += -moveSideward * 0.01;
            camera.position.y += moveUpward * 0.01;
        }

        deltaMouseX = 0;
        deltaMouseY = 0;
        
        if(SelectScene1 === true)
        {    
            renderer.render(scene1, camera);
        }
        if(SelectScene2 === true)
        {    
            renderer.render(scene2, camera);
        }
        if(SelectScene3 === true)
        {    
            renderer.render(scene3, camera);
        }

        prevTime = time;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
}
main();
