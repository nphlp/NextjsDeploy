(function () {
    try {
        var cookie = document.cookie.match(/theme-preference=([^;]+)/);
        if (!cookie) return;

        var parsed = JSON.parse(decodeURIComponent(cookie[1]));
        var theme = parsed.theme;

        if (theme === "system") {
            theme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
        }

        if (theme === "dark" || theme === "light") {
            document.documentElement.classList.add(theme);
        }
    } catch {}
})();
