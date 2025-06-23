window.addEventListener('load', () => {
    const startScreen = document.getElementById('startScreen');
    const startButton = document.getElementById('startButton');
    const optionsButton = document.getElementById('optionsButton');
    const pauseOverlay = document.getElementById('pauseOverlay');
    const pauseBtn = document.getElementById('pauseBtn');
    let game = null;

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
        startScreen.classList.add('hidden');
        if (!game) game = new Game();
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
