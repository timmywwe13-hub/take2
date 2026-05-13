window.GameHub = window.GameHub || {};

GameHub.snake = {
    canvas: null, ctx: null,
    snake: [], food: {x: 0, y: 0},
    dir: 'RIGHT', nextDir: 'RIGHT',
    score: 0, highscore: 0,
    paused: false, speed: 150,
    lastTime: 0, timer: 0,
    gameLoop: null,

    init() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.reset();
        this.start();
    },

    reset() {
        this.snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
        this.dir = 'RIGHT'; this.nextDir = 'RIGHT';
        this.score = 0; this.speed = 150; this.paused = false;
        this.spawnFood();
        this.updateUI();
    },

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
        if (this.snake.some(s => s.x === this.food.x && s.y === this.food.y)) this.spawnFood();
    },

    setDir(newDir) {
        const opposites = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
        if (newDir !== opposites[this.dir]) this.nextDir = newDir;
    },

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('sn-pause-msg').style.display = this.paused ? 'block' : 'none';
    },

    updateUI() {
        document.getElementById('sn-score').innerText = this.score;
        document.getElementById('sn-highscore').innerText = this.highscore;
    },

    start() {
        this.lastTime = performance.now();
        this.gameLoop = requestAnimationFrame((t) => this.loop(t));
    },

    stop() {
        cancelAnimationFrame(this.gameLoop);
    },

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.timer += deltaTime;

        if (!this.paused && this.timer >= this.speed) {
            this.update();
            this.draw();
            this.timer = 0;
        }

        this.gameLoop = requestAnimationFrame((t) => this.loop(t));
    },

    update() {
        this.dir = this.nextDir;
        const head = { ...this.snake[0] };

        if (this.dir === 'UP') head.y--;
        if (this.dir === 'DOWN') head.y++;
        if (this.dir === 'LEFT') head.x--;
        if (this.dir === 'RIGHT') head.x++;

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return this.gameOver();
        if (this.snake.some(s => s.x === head.x && s.y === head.y)) return this.gameOver();

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            if (this.score % 50 === 0) this.speed = Math.max(60, this.speed - 10);
            this.spawnFood();
            this.updateUI();
        } else {
            this.snake.pop();
        }
    },

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 400, 400);

        ctx.fillStyle = '#ef4444';
        this.drawRoundedRect(ctx, this.food.x * 20, this.food.y * 20, 18, 18, 5);

        this.snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#22d3ee' : '#0891b2';
            this.drawRoundedRect(ctx, s.x * 20, s.y * 20, 18, 18, 5);
        });
    },

    drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, w, h, r);
        ctx.fill();
    },

    gameOver() {
        if (this.score > this.highscore) this.highscore = this.score;
        this.updateUI();
        GameHub.app.showModal("Game Over!", `Score: ${this.score}`, "Try Again", () => {
            this.reset();
        });
    }
};