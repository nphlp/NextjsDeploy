(function () {
    try {
        var cookie = document.cookie.match(/theme-preference=([^;]+)/);
        var theme = "system";
        var resolved;

        if (cookie) {
            var parsed = JSON.parse(decodeURIComponent(cookie[1]));
            theme = parsed.theme;
            resolved = theme;
        }

        if (theme === "system") {
            resolved = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
        }

        document.documentElement.dataset.themePreference = theme;

        if (resolved === "dark" || resolved === "light") {
            document.documentElement.classList.add(resolved);
        }
    } catch {}
})();
