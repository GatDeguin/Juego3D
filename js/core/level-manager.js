class LevelManager {
    constructor(levels = []) {
        this.levels = levels;
        this.currentIndex = 0;
        this.progress = parseInt(localStorage.getItem('levelProgress') || '0', 10);
    }

    getUnlockedLevels() {
        return this.levels.slice(0, Math.min(this.progress + 1, this.levels.length));
    }

    startLevel(index, scene, onComplete) {
        this.currentIndex = index;
        const LevelClass = this.levels[index];
        return new LevelClass(scene, onComplete);
    }

    completeCurrentLevel() {
        if (this.currentIndex >= this.progress) {
            this.progress = this.currentIndex + 1;
            localStorage.setItem('levelProgress', this.progress);
        }
    }
}

window.LevelManager = LevelManager;
