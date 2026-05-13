window.GameHub = window.GameHub || {};

GameHub.settings = {
    changeBg(color) {
        document.body.style.backgroundColor = color;
    },
    changeAccent(color) {
        document.documentElement.style.setProperty('--accent-gold', color);
        document.documentElement.style.setProperty('--accent-green', color);
        document.documentElement.style.setProperty('--accent-cyan', color);
    }
};