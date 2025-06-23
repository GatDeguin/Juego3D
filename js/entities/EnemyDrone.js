class EnemyDrone {
    constructor(position = new THREE.Vector3()) {
        this.mesh = new THREE.Group();
        this.mesh.position.copy(position);

        const placeholder = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        this.mesh.add(placeholder);

        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/models/drone.glb',
            (gltf) => {
                this.mesh.remove(placeholder);
                this.mesh.add(gltf.scene);
            },
            undefined,
            (err) => console.error('Failed to load drone model', err)
        );

        this.speed = 1;
        this.direction = 1;
    }

    update(delta) {
        this.mesh.position.x += this.direction * this.speed * delta;
        if (Math.abs(this.mesh.position.x) > 5) {
            this.direction *= -1;
        }
    }
}

window.EnemyDrone = EnemyDrone;
