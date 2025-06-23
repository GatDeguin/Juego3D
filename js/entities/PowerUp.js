class PowerUp {
    /**
     * Simple collectible power-up.
     * @param {THREE.Vector3} position
     * @param {function(Player):void} onCollect Callback when collected
     */
    constructor(position, onCollect = () => {}) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.onCollect = onCollect;
        this.collected = false;
    }

    checkCollision(player) {
        if (this.collected) return;
        const playerBox = new THREE.Box3().setFromObject(player.mesh);
        const myBox = new THREE.Box3().setFromObject(this.mesh);
        if (playerBox.intersectsBox(myBox)) {
            this.collected = true;
            this.mesh.visible = false;
            this.onCollect(player);
        }
    }
}

window.PowerUp = PowerUp;
