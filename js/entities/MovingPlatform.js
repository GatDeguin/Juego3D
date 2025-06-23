class MovingPlatform {
    /**
     * Simple platform moving back and forth along one axis.
     * @param {THREE.Vector3} position Start position
     * @param {string} axis Axis to move on ('x', 'y' or 'z')
     * @param {number} distance Total travel distance
     * @param {number} speed Units per second
     */
    constructor(position, axis = 'x', distance = 5, speed = 2) {
        const geometry = new THREE.BoxGeometry(2, 0.5, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x3366ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);

        this.axis = axis;
        this.distance = distance;
        this.speed = speed;
        this.origin = position.clone();
        this.direction = 1;
    }

    update(delta) {
        const pos = this.mesh.position;
        pos[this.axis] += this.direction * this.speed * delta;
        const offset = pos[this.axis] - this.origin[this.axis];
        if (Math.abs(offset) >= this.distance / 2) {
            this.direction *= -1;
        }
    }
}

window.MovingPlatform = MovingPlatform;
