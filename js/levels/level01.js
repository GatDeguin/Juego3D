class Level01 {
    constructor(scene) {
        this.scene = scene;
        this.collidables = [];
        this.spawnPoints = [new THREE.Vector3(0, 2, 0)];
        this._createEnvironment();
    }

    _createEnvironment() {
        const floorGeo = new THREE.BoxGeometry(20, 1, 20);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x404040 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = -0.5;
        this.scene.add(floor);
        this.collidables.push(floor);

        const wallGeo = new THREE.BoxGeometry(1, 3, 20);
        const wallMat = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const wall1 = new THREE.Mesh(wallGeo, wallMat);
        wall1.position.set(-10, 1.5, 0);
        this.scene.add(wall1);
        this.collidables.push(wall1);

        const wall2 = wall1.clone();
        wall2.position.set(10, 1.5, 0);
        this.scene.add(wall2);
        this.collidables.push(wall2);

        const boxGeo = new THREE.BoxGeometry(2, 2, 2);
        const box = new THREE.Mesh(boxGeo, wallMat.clone());
        box.position.set(0, 1, -5);
        this.scene.add(box);
        this.collidables.push(box);
    }

    getCollidables() {
        return this.collidables;
    }

    getSpawnPoint(index = 0) {
        return this.spawnPoints[index] || new THREE.Vector3();
    }
}

window.Level01 = Level01;
