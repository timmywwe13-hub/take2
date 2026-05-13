window.GameHub = window.GameHub || {};

GameHub.app = {
    startGame(game) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${game}-screen`).classList.add('active');
        
        if (game === 'blackjack') GameHub.blackjack.init();
        if (game === 'scramble') GameHub.wordScramble.init();
        if (game === 'snake') GameHub.snake.init();
        if (game === 'cookie') GameHub.cookieClicker.init();
        if (game === 'dice') GameHub.diceRoll.init();
        if (game === 'fakemon') GameHub.fakemon.init();
        // Settings doesn't need a separate init function
    },

    showMenu() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('menu-screen').classList.add('active');
        
        if (GameHub.snake && GameHub.snake.stop) GameHub.snake.stop();
        if (GameHub.wordScramble && GameHub.wordScramble.timerInterval) {
            clearInterval(GameHub.wordScramble.timerInterval);
        }
        if (GameHub.fakemon && GameHub.fakemon.gameLoop) {
            cancelAnimationFrame(GameHub.fakemon.gameLoop);
        }
    },

    showModal(title, body, btnText, callback) {
        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-body').innerText = body;
        const btn = document.getElementById('modal-btn');
        btn.innerText = btnText;
        btn.onclick = () => {
            modal.style.display = 'none';
            callback();
        };
        modal.style.display = 'flex';
    }
};

// Global key listeners for Snake and FakeMon
window.addEventListener('keydown', (e) => {
    const isSnakeActive = document.getElementById('snake-screen').classList.contains('active');
    const isFakemonActive = document.getElementById('fakemon-screen').classList.contains('active');

    if (isSnakeActive) {
        if (e.key === 'ArrowUp') GameHub.snake.setDir('UP');
        if (e.key === 'ArrowDown') GameHub.snake.setDir('DOWN');
        if (e.key === 'ArrowLeft') GameHub.snake.setDir('LEFT');
        if (e.key === 'ArrowRight') GameHub.snake.setDir('RIGHT');
        if (e.key.toLowerCase() === 'p') GameHub.snake.togglePause();
    }

    if (isFakemonActive) {
        if (e.key === 'ArrowUp') GameHub.fakemon.setDir('UP');
        if (e.key === 'ArrowDown') GameHub.fakemon.setDir('DOWN');
        if (e.key === 'ArrowLeft') GameHub.fakemon.setDir('LEFT');
        if (e.key === 'ArrowRight') GameHub.fakemon.setDir('RIGHT');
    }
});