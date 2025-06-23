window.addEventListener('load', () => {
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    const levelMenu = document.getElementById('levelMenu');
    const optionsButton = document.getElementById('optionsButton');
    const pauseOverlay = document.getElementById('pauseOverlay');
    const pauseBtn = document.getElementById('pauseBtn');
    const manager = new LevelManager([Level01, Level02]);
    let game = null;

    const buildLevelMenu = () => {
        levelMenu.innerHTML = '';
        manager.levels.forEach((lvl, i) => {
            const btn = document.createElement('button');
            btn.textContent = `Nivel ${i + 1}`;
            btn.disabled = i > manager.progress;
            btn.addEventListener('click', () => startLevel(i));
            levelMenu.appendChild(btn);
        });
    };

    const startLevel = (index) => {
        startScreen.classList.add('hidden');
        levelMenu.classList.add('hidden');
        if (game) { game = null; }
        game = new Game('gameCanvas', manager.levels[index], () => {
            manager.completeCurrentLevel();
            buildLevelMenu();
            startScreen.classList.remove('hidden');
            startButton.classList.remove('hidden');
            game = null;
        });
    };

    const togglePause = () => {
        if (!game) return;
        game.togglePause();
        if (game.paused) {
            pauseOverlay.classList.add('visible');
        } else {
            pauseOverlay.classList.remove('visible');
        }
    };

    startButton.addEventListener('click', () => {
        startButton.classList.add('hidden');
        levelMenu.classList.remove('hidden');
        buildLevelMenu();
    });

    optionsButton.addEventListener('click', () => {
        alert('Opciones no implementadas');
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            togglePause();
        }
    });
    pauseBtn.addEventListener('click', togglePause);
});
