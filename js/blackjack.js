window.GameHub = window.GameHub || {};

GameHub.blackjack = {
    chips: 500,
    deck: [],
    playerHand: [],
    dealerHand: [],
    currentBet: 0,
    gameActive: false,

    init() {
        this.chips = 500;
        this.updateUI();
    },

    updateUI() {
        document.getElementById('bj-chips').innerText = this.chips;
    },

    adjustBet(amt) {
        let input = document.getElementById('bj-bet-input');
        let val = parseInt(input.value) + amt;
        if (val < 10) val = 10;
        if (val > this.chips) val = this.chips;
        input.value = val;
    },

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        this.deck = [];
        for (let s of suits) {
            for (let v of values) {
                this.deck.push({ value: v, suit: s, color: (s === '♥' || s === '♦') ? 'red' : 'black' });
            }
        }
        this.deck.sort(() => Math.random() - 0.5);
    },

    getHandValue(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            if (card.value === 'A') { aces++; value += 11; }
            else if (['J','Q','K'].includes(card.value)) { value += 10; }
            else { value += parseInt(card.value); }
        }
        while (value > 21 && aces > 0) { value -= 10; aces--; }
        return value;
    },

    renderCard(card, isHidden = false) {
        const div = document.createElement('div');
        div.className = `card ${isHidden ? 'hidden' : card.color}`;
        if (!isHidden) {
            div.innerHTML = `<div>${card.value}</div><div style="text-align:center; font-size:2rem">${card.suit}</div><div style="text-align:right">${card.value}</div>`;
        } else {
            div.innerHTML = `<div style="margin:auto">?</div>`;
        }
        return div;
    },

    deal() {
        this.currentBet = parseInt(document.getElementById('bj-bet-input').value);
        if (this.currentBet > this.chips) return alert("Not enough chips!");
        
        this.chips -= this.currentBet;
        this.updateUI();
        
        this.createDeck();
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        this.gameActive = true;
        
        document.getElementById('bj-deal-btn').style.display = 'none';
        document.getElementById('bj-action-btns').style.display = 'block';
        document.getElementById('bj-next-btn').style.display = 'none';
        document.getElementById('bj-message').innerText = "";
        document.getElementById('bj-dealer-score').style.display = 'none';
        
        this.updateTable();

        if (this.getHandValue(this.playerHand) === 21) {
            this.stand();
        }
    },

    updateTable() {
        const pHandDiv = document.getElementById('bj-player-hand');
        const dHandDiv = document.getElementById('bj-dealer-hand');
        pHandDiv.innerHTML = '';
        dHandDiv.innerHTML = '';
        
        this.playerHand.forEach(c => pHandDiv.appendChild(this.renderCard(c)));
        this.dealerHand.forEach((c, i) => {
            dHandDiv.appendChild(this.renderCard(c, i === 1 && this.gameActive));
        });
        
        document.getElementById('bj-player-score').innerText = `(${this.getHandValue(this.playerHand)})`;
    },

    hit() {
        this.playerHand.push(this.deck.pop());
        this.updateTable();
        if (this.getHandValue(this.playerHand) > 21) {
            this.endRound("Bust! Dealer wins.");
        }
    },

    double() {
        if (this.chips < this.currentBet) return alert("Not enough chips to double!");
        this.chips -= this.currentBet;
        this.currentBet *= 2;
        this.updateUI();
        this.hit();
        if (this.getHandValue(this.playerHand) <= 21) {
            this.stand();
        }
    },

    stand() {
        this.gameActive = false;
        let dValue = this.getHandValue(this.dealerHand);
        
        while (dValue < 17) {
            this.dealerHand.push(this.deck.pop());
            dValue = this.getHandValue(this.dealerHand);
        }
        
        this.updateTable();
        document.getElementById('bj-dealer-score').style.display = 'inline';
        document.getElementById('bj-dealer-score').innerText = `(${dValue})`;
        
        const pValue = this.getHandValue(this.playerHand);
        
        if (dValue > 21 || pValue > dValue) {
            let winAmt = this.currentBet * 2;
            if (pValue === 21 && this.playerHand.length === 2) winAmt = this.currentBet * 2.5;
            this.chips += winAmt;
            this.endRound("You Win!");
        } else if (pValue < dValue) {
            this.endRound("Dealer Wins.");
        } else {
            this.chips += this.currentBet;
            this.endRound("Push (Tie).");
        }
    },

    endRound(msg) {
        this.gameActive = false;
        document.getElementById('bj-message').innerText = msg;
        document.getElementById('bj-action-btns').style.display = 'none';
        document.getElementById('bj-next-btn').style.display = 'inline-block';
        this.updateUI();
        
        if (this.chips <= 0) {
            GameHub.app.showModal("Bankrupt!", "You ran out of chips!", "Restart Game", () => {
                this.chips = 500;
                this.updateUI();
                this.resetRound();
            });
        }
    },

    resetRound() {
        document.getElementById('bj-deal-btn').style.display = 'inline-block';
        document.getElementById('bj-action-btns').style.display = 'none';
        document.getElementById('bj-next-btn').style.display = 'none';
        document.getElementById('bj-dealer-hand').innerHTML = '';
        document.getElementById('bj-player-hand').innerHTML = '';
        document.getElementById('bj-player-score').innerText = '';
        document.getElementById('bj-dealer-score').style.display = 'none';
        document.getElementById('bj-message').innerText = '';
    }
};