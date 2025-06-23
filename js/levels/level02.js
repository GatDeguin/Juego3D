class Level02 {
    constructor(scene, onComplete = () => {}) {
        this.scene = scene;
        this.onComplete = onComplete;
        this.collidables = [];
        this.platforms = [];
        this.powerUps = [];
        this.spawnPoints = [new THREE.Vector3(0, 2, 0)];
        this.totalPowerUps = 0;
        this.collected = 0;
        this._createEnvironment();
    }

    _createEnvironment() {
        const floorGeo = new THREE.BoxGeometry(30, 1, 30);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x303030 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = -0.5;
        this.scene.add(floor);
        this.collidables.push(floor);

        const boxGeo = new THREE.BoxGeometry(2, 2, 2);
        const wallMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const box1 = new THREE.Mesh(boxGeo, wallMat);
        box1.position.set(-4, 1, -5);
        this.scene.add(box1);
        this.collidables.push(box1);

        const box2 = box1.clone();
        box2.position.set(4, 1, -5);
        this.scene.add(box2);
        this.collidables.push(box2);

        const moving = new MovingPlatform(new THREE.Vector3(0, 1.5, 5), 'z', 8, 2);
        this.scene.add(moving.mesh);
        this.platforms.push(moving);
        this.collidables.push(moving.mesh);

        const positions = [new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(5, 1.5, 0)];
        for (const pos of positions) {
            const power = new PowerUp(pos, () => this._powerUpCollected());
            this.scene.add(power.mesh);
            this.powerUps.push(power);
            this.totalPowerUps++;
        }
    }

    _powerUpCollected() {
        this.collected++;
        if (this.collected >= this.totalPowerUps) {
            this.onComplete();
        }
    }

    getCollidables() {
        return this.collidables;
    }

    update(delta, player) {
        for (const plat of this.platforms) {
            plat.update(delta);
        }
        for (const p of this.powerUps) {
            p.checkCollision(player);
        }
    }

    getSpawnPoint(index = 0) {
        return this.spawnPoints[index] || new THREE.Vector3();
    }
}

window.Level02 = Level02;
