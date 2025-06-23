import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const player = new THREE.Mesh(geometry, material);
scene.add(player);

camera.position.z = 5;
let gravity = new THREE.Vector3(0, -0.01, 0);
let velocity = new THREE.Vector3();

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        gravity.set(-gravity.y, gravity.x, 0); // rotate 90 degrees left
    } else if (event.key === 'ArrowRight') {
        gravity.set(gravity.y, -gravity.x, 0); // rotate 90 degrees right
    }
}
window.addEventListener('keydown', onKeyDown);

function animate() {
    requestAnimationFrame(animate);
    velocity.add(gravity);
    player.position.add(velocity);

    // keep player within view bounds
    if (player.position.length() > 10) {
        player.position.set(0, 0, 0);
        velocity.set(0, 0, 0);
    }
    renderer.render(scene, camera);
}

animate();
