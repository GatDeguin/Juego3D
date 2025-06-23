class GravityController {
    constructor(gravity = new THREE.Vector3(0, -9.8, 0)) {
        this.gravity = gravity.clone();
        // Damping factor applied per second
        this.damping = 0.9;
    }

    rotate(axis) {
        const ninety = Math.PI / 2;
        let quat = new THREE.Quaternion();
        switch (axis) {
            case 'x':
                quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ninety);
                break;
            case 'y':
                quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ninety);
                break;
            case 'z':
                quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), ninety);
                break;
            default:
                return;
        }
        this.gravity.applyQuaternion(quat);
        this.gravity.normalize().multiplyScalar(9.8);
    }

    applyTo(velocity, delta) {
        velocity.addScaledVector(this.gravity, delta);
        const dampingFactor = Math.pow(this.damping, delta);
        velocity.multiplyScalar(dampingFactor);
    }

    get vector() {
        return this.gravity.clone();
    }
}

window.GravityController = GravityController;
