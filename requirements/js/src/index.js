import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as THREE from 'three';

/*Import classes*/
import { router } from './js/Router.js';

window.addEventListener("popstate", () => {
    router();
});

window.addEventListener("onpopstate", () => {
    router();
});
m-shell

let scene, camera, renderer, particles;

function init_background() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);

    let particlesGeometry = new THREE.BufferGeometry();
    let particlesCount = 2500;
    let positions = new Float32Array(particlesCount * 3);
    let colors = [
        0x3f2a7b, 
        0xfbf9f3,
        0x5aa8c1,
        0x816587, 
        0xf58d70,
        0xefa194,
        0xa5a2b2,
        0xcbc7cc,
        0xe5d0dc,
        0xd7bdb1
    ];
    let colorArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;

        let color = colors[Math.floor(Math.random() * colors.length)];
        colorArray[i * 3] = ((color >> 16) & 0xff) / 255; 
        colorArray[i * 3 + 1] = ((color >> 8) & 0xff) / 255;
        colorArray[i * 3 + 2] = (color & 0xff) / 255;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    let particlesMaterial = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.03,
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    animate();
}


function animate() {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init_background();
