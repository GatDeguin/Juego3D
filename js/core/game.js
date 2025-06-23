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
            if (e.code === 'KeyG') this.gravity.rotate('x');
            if (e.code === 'KeyH') this.gravity.rotate('y');
            if (e.code === 'KeyJ') this.gravity.rotate('z');
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

        const speed = 5;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.velocity.x -= speed * delta;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.velocity.x += speed * delta;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.player.velocity.z -= speed * delta;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.velocity.z += speed * delta;
        }

        this.gravity.applyTo(this.player.velocity, delta);
        this.player.mesh.position.addScaledVector(this.player.velocity, delta);
        this.camera.position.addScaledVector(this.player.velocity, delta);
        this.camera.lookAt(this.player.mesh.position);
        this.renderer.render(this.scene, this.camera);
    }
}

window.Game = Game;
