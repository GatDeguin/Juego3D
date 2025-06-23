class MarcusThorne {
    constructor(position = new THREE.Vector3()) {
        this.mesh = new THREE.Group();
        this.mesh.position.copy(position);

        const placeholder = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.6, 0.4),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        this.mesh.add(placeholder);

        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/models/marcus_thorne.glb',
            (gltf) => {
                this.mesh.remove(placeholder);
                this.mesh.add(gltf.scene);
            },
            undefined,
            (err) => console.error('Failed to load Marcus Thorne model', err)
        );
    }

    update(delta) {
        this.mesh.rotation.y += delta;
    }
}

window.MarcusThorne = MarcusThorne;
