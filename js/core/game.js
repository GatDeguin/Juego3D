class Game {
    constructor(canvasId = 'gameCanvas') {
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
        this.gravity = new GravityController();
        this.player = new Player();
        this.scene.add(this.player.mesh);
        this.camera.position.set(0, 2, 5);

        this._setupScene();
        this._setupControls();

        this.animate = this.animate.bind(this);
        window.addEventListener('resize', () => this._onResize());
        this._onResize();
        requestAnimationFrame(this.animate);
    }

    _setupScene() {
        const planeGeo = new THREE.PlaneGeometry(50, 50);
        const planeMat = new THREE.MeshBasicMaterial({ color: 0x404040, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
    }

    _setupControls() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyG') {
                this.gravity.rotate('x');
                this.player.onGravityChange(this.gravity.vector);
            }
            if (e.code === 'KeyH') {
                this.gravity.rotate('y');
                this.player.onGravityChange(this.gravity.vector);
            }
            if (e.code === 'KeyJ') {
                this.gravity.rotate('z');
                this.player.onGravityChange(this.gravity.vector);
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
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

        this.player.update(delta, this.keys, this.gravity);
        this.camera.position.addScaledVector(this.player.velocity, delta);
        this.camera.lookAt(this.player.mesh.position);
        this.renderer.render(this.scene, this.camera);
    }
}

window.Game = Game;
