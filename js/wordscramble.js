window.GameHub = window.GameHub || {};

GameHub.wordScramble = {
    words: [
        {w: 'Elephant', d: 1}, {w: 'Giraffe', d: 1}, {w: 'Kangaroo', d: 1}, {w: 'Penguin', d: 1}, {w: 'Hamster', d: 1},
        {w: 'Japan', d: 1}, {w: 'Canada', d: 1}, {w: 'Brazil', d: 1}, {w: 'France', d: 1}, {w: 'Egypt', d: 1},
        {w: 'Pizza', d: 1}, {w: 'Burger', d: 1}, {w: 'Taco', d: 1}, {w: 'Sushi', d: 1}, {w: 'Pasta', d: 1},
        {w: 'Soccer', d: 1}, {w: 'Tennis', d: 1}, {w: 'Hockey', d: 1}, {w: 'Rugby', d: 1}, {w: 'Boxing', d: 1},
        {w: 'Astronaut', d: 2}, {w: 'Architect', d: 2}, {w: 'Detective', d: 2}, {w: 'Engineer', d: 2}, {w: 'Musician', d: 2},
        {w: 'Australia', d: 2}, {w: 'Argentina', d: 2}, {w: 'Thailand', d: 2}, {w: 'Iceland', d: 2}, {w: 'Germany', d: 2},
        {w: 'Chocolate', d: 2}, {w: 'Avocado', d: 2}, {w: 'Pineapple', d: 2}, {w: 'Coconut', d: 2}, {w: 'Pumpkin', d: 2},
        {w: 'Synchronize', d: 3}, {w: 'Philosophy', d: 3}, {w: 'Atmosphere', d: 3}, {w: 'Algorithm', d: 3}, {w: 'Hypothesis', d: 3}
    ],
    currentWord: '',
    scrambled: '',
    score: 0,
    streak: 0,
    count: 0,
    timer: 30,
    timerInterval: null,
    difficulty: 1,
    hintUsed: false,

    init() {
        this.score = 0; this.streak = 0; this.count = 0; this.difficulty = 1;
        this.nextWord();
        document.getElementById('sc-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });
    },

    nextWord() {
        this.count++;
        if (this.count > 10) {
            this.endGame();
            return;
        }

        this.hintUsed = false;
        document.getElementById('sc-hint-btn').disabled = false;
        document.getElementById('sc-count').innerText = this.count;
        document.getElementById('sc-input').value = '';
        
        const pool = this.words.filter(w => w.d <= this.difficulty);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        this.currentWord = pick.w;
        
        let s = this.currentWord.split('').sort(() => Math.random() - 0.5).join('');
        while (s.toLowerCase() === this.currentWord.toLowerCase()) {
            s = this.currentWord.split('').sort(() => Math.random() - 0.5).join('');
        }
        this.scrambled = s;
        document.getElementById('sc-word').innerText = this.scrambled;
        
        this.startTimer();
    },

    startTimer() {
        clearInterval(this.timerInterval);
        this.timer = 30;
        const bar = document.getElementById('sc-timer-bar');
        
        this.timerInterval = setInterval(() => {
            this.timer -= 0.1;
            bar.style.width = (this.timer / 30 * 100) + '%';
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.streak = 0;
                this.updateStats();
                this.nextWord();
            }
        }, 100);
    },

    checkGuess() {
        const guess = document.getElementById('sc-input').value.trim().toLowerCase();
        if (guess === this.currentWord.toLowerCase()) {
            let points = 10;
            if (this.timer > 25) points += 5;
            this.score += points;
            this.streak++;
            
            if (this.streak % 5 === 0) {
                this.difficulty++;
            }
            
            this.updateStats();
            clearInterval(this.timerInterval);
            this.nextWord();
        } else {
            document.getElementById('sc-input').style.border = '2px solid red';
            setTimeout(() => { document.getElementById('sc-input').style.border = 'none'; }, 500);
        }
    },

    useHint() {
        if (this.hintUsed) return;
        this.score = Math.max(0, this.score - 3);
        this.updateStats();
        this.hintUsed = true;
        document.getElementById('sc-hint-btn').disabled = true;
        
        const idx = Math.floor(Math.random() * this.currentWord.length);
        alert(`Hint: The letter at position ${idx + 1} is ${this.currentWord[idx]}`);
    },

    updateStats() {
        document.getElementById('sc-score').innerText = this.score;
        document.getElementById('sc-streak').innerText = this.streak;
    },

    endGame() {
        clearInterval(this.timerInterval);
        GameHub.app.showModal("Game Complete!", `Final Score: ${this.score}`, "Play Again", () => {
            this.init();
        });
    }
};