class Game {
    constructor(canvasId = 'gameCanvas', levelClass = Level01, onComplete = () => {}) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.clock = new THREE.Clock();
        this.paused = false;
        this.gravity = new GravityController();
        this.player = new Player();
        this.scene.add(this.player.mesh);
        this.camera.position.set(0, 2, 5);

        this.levelClass = levelClass;
        this.onComplete = onComplete;
        this._setupScene();
        this._setupControls();
        this._setupAudio();

        this.animate = this.animate.bind(this);
        window.addEventListener('resize', () => this._onResize());
        this._onResize();
        requestAnimationFrame(this.animate);
    }

    togglePause() {
        this.paused = !this.paused;
    }

    _setupScene() {
        this.level = new this.levelClass(this.scene, this.onComplete);
        this.player.mesh.position.copy(this.level.getSpawnPoint());
    }

    _setupControls() {
        this.input = new InputHandler();
        this.keys = this.input.keys;
    }

    _setupAudio() {
        this.audio = new AudioManager(this.camera);
        window.audioManager = this.audio;
        const loads = [
            this.audio.load('jump', 'assets/audio/jump.wav'),
            this.audio.load('gravity', 'assets/audio/gravity.wav'),
            this.audio.load('pickup', 'assets/audio/pickup.wav'),
            this.audio.load('background', 'assets/audio/background.wav'),
        ];
        Promise.all(loads).then(() => {
            this.bgMusic = this.audio.play('background', {
                loop: true,
                volume: 0.5,
            });
        }).catch(err => {
            console.warn('Audio files missing, running without sound.', err);
        });
    }

    _onResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (!this.paused) {
            this.input.update();

            if (this.input.wasPressed('KeyG')) {
                this.gravity.rotate('x');
                this.player.onGravityChange(this.gravity.vector);
                if (window.audioManager) window.audioManager.play('gravity');
            }
            if (this.input.wasPressed('KeyH')) {
                this.gravity.rotate('y');
                this.player.onGravityChange(this.gravity.vector);
                if (window.audioManager) window.audioManager.play('gravity');
            }
            if (this.input.wasPressed('KeyJ')) {
                this.gravity.rotate('z');
                this.player.onGravityChange(this.gravity.vector);
                if (window.audioManager) window.audioManager.play('gravity');
            }

            const actions = {
                jump: this.input.wasPressed('Space'),
                dash: this.input.wasPressed('KeyK'),
            };

            this.player.update(delta, this.keys, this.gravity, this.level.getCollidables(), actions);
            this.level.update(delta, this.player);
            this.camera.position.addScaledVector(this.player.velocity, delta);
            this.camera.lookAt(this.player.mesh.position);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

window.Game = Game;
