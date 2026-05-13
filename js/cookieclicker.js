window.GameHub = window.GameHub || {};

GameHub.cookieClicker = {
    cookies: 0,
    cps: 0,
    upgrades: [
        { name: "Cursor", cost: 15, power: 0.1, count: 0, emoji: "🖱️" },
        { name: "Grandma", cost: 100, power: 1, count: 0, emoji: "👵" },
        { name: "Farm", cost: 1100, power: 8, count: 0, emoji: "🌾" },
        { name: "Mine", cost: 12000, power: 47, count: 0, emoji: "⛏️" },
        { name: "Factory", cost: 130000, power: 260, count: 0, emoji: "🏭" },
        { name: "Bank", cost: 1400000, power: 1400, count: 0, emoji: "🏦" },
        { name: "Temple", cost: 20000000, power: 7800, count: 0, emoji: "🏛️" },
        { name: "Wizard", cost: 330000000, power: 44000, count: 0, emoji: "🧙" },
        { name: "Shipment", cost: 5100000000, power: 260000, count: 0, emoji: "🚀" },
    ],

    init() {
        this.renderUpgrades();
        this.startAutoClick();
        this.updateUI();
    },

    clickCookie() {
        this.cookies++;
        this.updateUI();
    },

    startAutoClick() {
        setInterval(() => {
            this.cookies += this.cps / 10;
            this.updateUI();
        }, 100);
    },

    renderUpgrades() {
        const list = document.getElementById('upgrade-list');
        list.innerHTML = '';
        this.upgrades.forEach((upg, index) => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn';
            btn.id = `upg-${index}`;
            btn.onclick = () => this.buyUpgrade(index);
            btn.innerHTML = `${upg.emoji} ${upg.name}<br>Cost: ${Math.floor(upg.cost)}<br>+${upg.power} CPS`;
            list.appendChild(btn);
        });
    },

    buyUpgrade(index) {
        const upg = this.upgrades[index];
        if (this.cookies >= upg.cost) {
            this.cookies -= upg.cost;
            upg.count++;
            this.cps += upg.power;
            upg.cost *= 1.15; // Price increases by 15% each time
            this.renderUpgrades();
            this.updateUI();
        }
    },

    updateUI() {
        document.getElementById('cookie-count').innerText = `${Math.floor(this.cookies)} Cookies`;
        document.getElementById('cookie-cps').innerText = `CPS: ${this.cps.toFixed(1)}`;
        
        this.upgrades.forEach((upg, index) => {
            const btn = document.getElementById(`upg-${index}`);
            if (btn) btn.disabled = this.cookies < upg.cost;
        });
    }
};