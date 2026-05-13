window.GameHub = window.GameHub || {};

GameHub.fakemon = {
    canvas: null, ctx: null,
    player: { x: 250, y: 250, size: 20, speed: 4, dir: 'STOP' },
    monsters: [],
    caught: 0,
    monstersPool: ['🐶', '🐱', '🐉', '🦊', '🦁', '🐹', '🐨', '🐯', '🐸', '🦄'],

    init() {
        this.canvas = document.getElementById('fakemonCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.caught = 0;
        this.player.x = 250; this.player.y = 250;
        this.spawnMonsters();
        this.startLoop();
    },

    spawnMonsters() {
        this.monsters = [];
        for (let i = 0; i < 10; i++) {
            this.monsters.push({
                x: Math.random() * 460 + 20,
                y: Math.random() * 460 + 20,
                emoji: this.monstersPool[Math.floor(Math.random() * this.monstersPool.length)],
                caught: false
            });
        }
    },

    setDir(d) { this.player.dir = d; },

    startLoop() {
        this.gameLoop = requestAnimationFrame(() => this.loop());
    },

    loop() {
        this.update();
        this.draw();
        this.gameLoop = requestAnimationFrame(() => this.loop());
    },

    update() {
        if (this.player.dir === 'UP') this.player.y -= this.player.speed;
        if (this.player.dir === 'DOWN') this.player.y += this.player.speed;
        if (this.player.dir === 'LEFT') this.player.x -= this.player.speed;
        if (this.player.dir === 'RIGHT') this.player.x += this.player.speed;

        // Bounds
        this.player.x = Math.max(0, Math.min(500 - this.player.size, this.player.x));
        this.player.y = Math.max(0, Math.min(500 - this.player.size, this.player.y));

        // Collision detection
        this.monsters.forEach(m => {
            if (!m.caught) {
                let dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
                if (dist < 30) {
                    m.caught = true;
                    this.caught++;
                    document.getElementById('fakemon-caught').innerText = this.caught;
                    if (this.caught === 10) {
                        GameHub.app.showModal("Master Trainer!", "You caught them all!", "Restart", () => this.init());
                    }
                }
            }
        });
    },

    draw() {
        this.ctx.clearRect(0, 0, 500, 500);
        
        // Draw Monsters
        this.ctx.font = "24px Arial";
        this.monsters.forEach(m => {
            if (!m.caught) this.ctx.fillText(m.emoji, m.x, m.y);
        });

        // Draw Player
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.size, this.player.size);
    }
};