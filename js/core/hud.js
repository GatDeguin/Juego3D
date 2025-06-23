class HUD {
    constructor(player) {
        this.player = player;
        this.energyBar = document.getElementById('energyBar');
        this.gravityRemainingEl = document.getElementById('gravityRemaining');
        this.minimapEl = document.getElementById('minimap');
    }

    update() {
        if (this.energyBar) {
            const pct = Math.max(0, Math.min(1, this.player.energy / this.player.maxEnergy));
            this.energyBar.style.width = `${pct * 100}%`;
        }
        if (this.gravityRemainingEl) {
            this.gravityRemainingEl.textContent = this.player.gravityChangesLeft;
        }
        if (this.minimapEl) {
            const pos = this.player.mesh.position;
            this.minimapEl.textContent = `X: ${pos.x.toFixed(1)} Z: ${pos.z.toFixed(1)}`;
        }
    }
}

window.HUD = HUD;
