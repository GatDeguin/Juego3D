const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function init() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('load', init);
