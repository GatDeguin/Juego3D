class Player {
    constructor() {
        // Container used while the model loads
        this.mesh = new THREE.Group();
        const placeholder = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial()
        );
        this.mesh.add(placeholder);

        // Load Alex Vega model
        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/models/alex_vega.glb',
            (gltf) => {
                this.mesh.remove(placeholder);
                this.mesh.add(gltf.scene);
            },
            undefined,
            (err) => console.error('Failed to load Alex Vega model', err)
        );

        // Velocity is integrated each frame in Game.animate
        this.velocity = new THREE.Vector3();

        // Simple energy mechanic used by the HUD
        this.maxEnergy = 100;
        this.energy = this.maxEnergy;
        this.energyRegen = 10; // per second

        // Remaining gravity rotations available
        this.gravityChangesLeft = 3;

        // Whether the player is on the ground.  This simple demo considers the
        // plane at y = 0 as the floor regardless of gravity orientation.
        this.isGrounded = false;

        // Bounds used by resetIfOutOfBounds
        this.bounds = 30;
    }

    /**
     * Called every frame from the main game loop.
     * @param {number} delta - seconds since last frame
     * @param {object} keys - dictionary with pressed keys
     * @param {GravityController} gravity
     */
    update(delta, keys, gravity, collidables = [], actions = {}) {
        this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen * delta);
        const speed = 5;
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocity.x -= speed * delta;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocity.x += speed * delta;
        }
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.velocity.z -= speed * delta;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.velocity.z += speed * delta;
        }

        if (actions.jump) {
            this.jump(gravity.vector);
        }
        if (actions.dash) {
            this.dash();
        }

        // Apply gravity and integrate velocity
        gravity.applyTo(this.velocity, delta);
        this.mesh.position.addScaledVector(this.velocity, delta);

        this.isGrounded = false;
        this._applyCollisions(collidables, gravity.vector);

        this.resetIfOutOfBounds();
    }

    /**
     * Give the player an impulse opposite to the gravity vector when grounded.
     * @param {THREE.Vector3} gravityVector
     */
    jump(gravityVector) {
        if (!this.isGrounded || this.energy < 10) return;
        const jumpStrength = 5;
        const impulse = gravityVector.clone().normalize().multiplyScalar(-jumpStrength);
        this.velocity.add(impulse);
        this.isGrounded = false;
        this.energy -= 10;
        if (window.audioManager) window.audioManager.play('jump');
    }

    /**
     * Called whenever the gravity controller rotates while the player is in the
     * air.  Applies a small dash along the new gravity direction.
     * @param {THREE.Vector3} newGravity
     */
    onGravityChange(newGravity) {
        if (this.isGrounded) return;
        const dashStrength = 8;
        const impulse = newGravity.clone().normalize().multiplyScalar(dashStrength);
        this.velocity.add(impulse);
    }

    /**
     * Dash in the current horizontal movement direction.
     */
    dash() {
        if (this.energy < 20) return;
        const dir = this.velocity.clone();
        dir.y = 0;
        if (dir.lengthSq() === 0) {
            dir.set(0, 0, -1);
        } else {
            dir.normalize();
        }
        const dashStrength = 8;
        this.velocity.addScaledVector(dir, dashStrength);
        this.energy -= 20;
    }

    useGravityChange() {
        if (this.gravityChangesLeft > 0) {
            this.gravityChangesLeft--;
        }
    }

    /**
     * Resets the player's position if they have moved too far from the origin.
     */
    resetIfOutOfBounds() {
        const p = this.mesh.position;
        if (Math.abs(p.x) > this.bounds || Math.abs(p.y) > this.bounds || Math.abs(p.z) > this.bounds) {
            this.mesh.position.set(0, 2, 0);
            this.velocity.set(0, 0, 0);
        }
    }

    /**
     * Naive collision handling against a list of meshes.
     * Collisions are resolved along the current gravity axis so the
     * player can stand and walk on top of objects regardless of the
     * orientation.
     * @param {THREE.Mesh[]} collidables
     * @param {THREE.Vector3} gravityVector
     */
    _applyCollisions(collidables, gravityVector) {
        const axis = this._gravityAxis(gravityVector);
        const playerBox = new THREE.Box3().setFromObject(this.mesh);
        for (const obj of collidables) {
            const objBox = new THREE.Box3().setFromObject(obj);
            if (playerBox.intersectsBox(objBox)) {
                const vel = this.velocity[axis.name];
                const fromAbove = axis.sign < 0
                    ? vel <= 0 && playerBox.min[axis.name] >= objBox.max[axis.name] - 0.1
                    : vel >= 0 && playerBox.max[axis.name] <= objBox.min[axis.name] + 0.1;
                if (fromAbove) {
                    this.mesh.position[axis.name] =
                        axis.sign < 0 ? objBox.max[axis.name] + 0.5 : objBox.min[axis.name] - 0.5;
                    this.velocity[axis.name] = 0;
                    this.isGrounded = true;
                    playerBox.setFromObject(this.mesh);
                }
            }
        }
    }

    _gravityAxis(vector) {
        const abs = vector.clone().abs();
        if (abs.x >= abs.y && abs.x >= abs.z) return { name: 'x', sign: Math.sign(vector.x) };
        if (abs.y >= abs.x && abs.y >= abs.z) return { name: 'y', sign: Math.sign(vector.y) };
        return { name: 'z', sign: Math.sign(vector.z) };
    }
}

window.Player = Player;
