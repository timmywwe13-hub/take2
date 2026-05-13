window.GameHub = window.GameHub || {};

GameHub.diceRoll = {
    balance: 500,

    init() {
        this.updateUI();
    },

    updateUI() {
        document.getElementById('dice-balance').innerText = this.balance;
    },

    roll() {
        const bet = parseInt(document.getElementById('dice-bet-amount').value);
        const picked = document.getElementById('dice-number').value;
        const display = document.getElementById('dice-result-display');
        const msg = document.getElementById('dice-message');

        if (isNaN(bet) || bet <= 0) return alert("Enter a valid bet!");
        if (bet > this.balance) return alert("Not enough money!");

        this.balance -= bet;
        this.updateUI();

        // Animation effect
        let rolls = 0;
        const interval = setInterval(() => {
            display.innerText = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
            rolls++;
            if (rolls > 10) {
                clearInterval(interval);
                this.finalizeRoll(picked, bet, display, msg);
            }
        }, 100);
    },

    finalizeRoll(picked, bet, display, msg) {
        const result = Math.floor(Math.random() * 6) + 1;
        display.innerText = `🎲 ${result}`;

        if (result == picked) {
            const win = bet * 5; // 5x payout for a single number
            this.balance += win;
            msg.innerText = `JACKPOT! You won $${win}!`;
            msg.style.color = "lime";
        } else {
            msg.innerText = "Wrong number! You lost your bet.";
            msg.style.color = "red";
        }
        this.updateUI();
    }
};