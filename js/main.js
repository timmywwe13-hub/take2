window.GameHub = window.GameHub || {};

GameHub.app = {
    startGame(game) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`${game}-screen`).classList.add('active');
        
        if (game === 'blackjack') GameHub.blackjack.init();
        if (game === 'scramble') GameHub.wordScramble.init();
        if (game === 'snake') GameHub.snake.init();
    },

    showMenu() {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('menu-screen').classList.add('active');
        
        // Stop background processes
        if (GameHub.snake && GameHub.snake.stop) GameHub.snake.stop();
        if (GameHub.wordScramble && GameHub.wordScramble.timerInterval) {
            clearInterval(GameHub.wordScramble.timerInterval);
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

// Global key listeners for Snake
window.addEventListener('keydown', (e) => {
    if (!document.getElementById('snake-screen').classList.contains('active')) return;
    
    if (e.key === 'ArrowUp') GameHub.snake.setDir('UP');
    if (e.key === 'ArrowDown') GameHub.snake.setDir('DOWN');
    if (e.key === 'ArrowLeft') GameHub.snake.setDir('LEFT');
    if (e.key === 'ArrowRight') GameHub.snake.setDir('RIGHT');
    if (e.key.toLowerCase() === 'p') GameHub.snake.togglePause();
});