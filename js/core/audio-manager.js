class AudioManager {
    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.loader = new THREE.AudioLoader();
        this.buffers = {};
    }

    load(name, url) {
        return new Promise((resolve, reject) => {
            this.loader.load(url, buffer => {
                this.buffers[name] = buffer;
                resolve();
            }, undefined, err => reject(err));
        });
    }

    play(name, options = {}) {
        const buffer = this.buffers[name];
        if (!buffer) return;
        const sound = new THREE.Audio(this.listener);
        sound.setBuffer(buffer);
        sound.setLoop(!!options.loop);
        if (options.volume !== undefined) sound.setVolume(options.volume);
        sound.play();
        return sound;
    }
}

window.AudioManager = AudioManager;
