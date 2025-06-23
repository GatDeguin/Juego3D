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
    update(delta, keys, gravity) {
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

        // Very naive ground check assuming the floor lies on the Y axis
        if (this.mesh.position.y <= 0.5 && gravity.vector.y < 0) {
            this.isGrounded = true;
            this.mesh.position.y = 0.5;
            this.velocity.y = 0;
        } else {
            this.isGrounded = false;
        }

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
}

window.Player = Player;
