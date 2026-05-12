const lintStagedConfig = {
    "*.{js,ts,tsx,mts}": (files) => [`eslint --fix ${files.join(" ")}`, `vitest related --run ${files.join(" ")}`],

    // Prettier — single command, resolves the closest config per file
    "*.{js,ts,tsx,json,css,md,yml,yaml,mjs,mts}": "prettier --write",
};

export default lintStagedConfig;
