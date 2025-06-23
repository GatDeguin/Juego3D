class Player {
    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);

        // Velocity is integrated each frame in Game.animate
        this.velocity = new THREE.Vector3();

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
    update(delta, keys, gravity, collidables = []) {
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

        if (keys['Space']) {
            this.jump(gravity.vector);
            // Prevent continuous jumping while the key is held down
            keys['Space'] = false;
        }

        // Apply gravity and integrate velocity
        gravity.applyTo(this.velocity, delta);
        this.mesh.position.addScaledVector(this.velocity, delta);

        this.isGrounded = false;
        this._applyCollisions(collidables);

        this.resetIfOutOfBounds();
    }

    /**
     * Give the player an impulse opposite to the gravity vector when grounded.
     * @param {THREE.Vector3} gravityVector
     */
    jump(gravityVector) {
        if (!this.isGrounded) return;
        const jumpStrength = 5;
        const impulse = gravityVector.clone().normalize().multiplyScalar(-jumpStrength);
        this.velocity.add(impulse);
        this.isGrounded = false;
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
     * Collisions are only resolved on the Y axis so the player can
     * stand and walk on top of objects.
     * @param {THREE.Mesh[]} collidables
     */
    _applyCollisions(collidables) {
        const playerBox = new THREE.Box3().setFromObject(this.mesh);
        for (const obj of collidables) {
            const objBox = new THREE.Box3().setFromObject(obj);
            if (playerBox.intersectsBox(objBox)) {
                // Check if the player is coming from above the object
                if (this.velocity.y <= 0 && playerBox.min.y >= objBox.max.y - 0.1) {
                    this.mesh.position.y = objBox.max.y + 0.5;
                    this.velocity.y = 0;
                    this.isGrounded = true;
                    playerBox.setFromObject(this.mesh);
                }
            }
        }
    }
}

window.Player = Player;
