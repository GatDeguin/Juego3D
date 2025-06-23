class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this._setupKeyboard();
        this._setupTouch();
    }

    _setKey(code, pressed) {
        if (pressed) {
            if (!this.keys[code]) {
                this.justPressed[code] = true;
            }
            this.keys[code] = true;
        } else {
            this.keys[code] = false;
        }
    }

    _setupKeyboard() {
        window.addEventListener('keydown', e => this._setKey(e.code, true));
        window.addEventListener('keyup', e => this._setKey(e.code, false));
    }

    _setupTouch() {
        const map = (id, code) => {
            const el = document.getElementById(id);
            if (!el) return;
            const start = ev => { ev.preventDefault(); this._setKey(code, true); };
            const end = ev => { ev.preventDefault(); this._setKey(code, false); };
            el.addEventListener('touchstart', start);
            el.addEventListener('touchend', end);
            el.addEventListener('touchcancel', end);
        };
        map('btnJump', 'Space');
        map('btnDash', 'KeyK');
        map('btnRotX', 'KeyG');
        map('btnRotY', 'KeyH');
        map('btnRotZ', 'KeyJ');
    }

    update() {
        this._updateGamepad();
    }

    _updateGamepad() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = pads[0];
        if (!gp) return;
        this._setKey('Space', gp.buttons[0]?.pressed);
        this._setKey('KeyJ', gp.buttons[1]?.pressed);
        this._setKey('KeyK', gp.buttons[2]?.pressed);
        this._setKey('KeyG', gp.buttons[4]?.pressed);
        this._setKey('KeyH', gp.buttons[5]?.pressed);

        const dz = 0.2;
        const ax = gp.axes[0] || 0;
        const ay = gp.axes[1] || 0;
        this._setKey('ArrowLeft', ax < -dz);
        this._setKey('ArrowRight', ax > dz);
        this._setKey('ArrowUp', ay < -dz);
        this._setKey('ArrowDown', ay > dz);
    }

    wasPressed(code) {
        if (this.justPressed[code]) {
            this.justPressed[code] = false;
            return true;
        }
        return false;
    }
}

window.InputHandler = InputHandler;
