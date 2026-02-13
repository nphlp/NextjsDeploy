/**
 * Environment file generator — plain Node.js, zero dependencies
 *
 * Reads env/env.config.json and generates .env files for each environment.
 *
 * Usage: node scripts/generate-env.mjs
 */
import { writeFileSync, existsSync } from "node:fs";
import { resolve, join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONFIG_PATH = join(ROOT, "env", "env.config.mjs");
const ENV_DIR = join(ROOT, "env");

// ─── Helpers ──────────────────────────────────────────────────

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

/** UPPER_SNAKE_CASE key = env variable */
const isEnvVar = (key) => /^[A-Z][A-Z0-9_]*$/.test(key);

/** Needs quotes in .env file */
const needsQuotes = (value) => /[\s"'()!]/.test(value);

/** Format a single KEY=value line */
const formatVar = (key, value) => `${key}=${needsQuotes(value) ? `"${value}"` : value}`;

// ─── Extract ──────────────────────────────────────────────────

/**
 * Extract env variables from a group object.
 * - UPPER_SNAKE_CASE keys → active var
 * - "#KEY" → commented alternative(s), supports arrays
 * - Non-commented key always takes priority over commented
 */
function extractVars(group) {
    const vars = {};
    for (const [key, value] of Object.entries(group)) {
        if (key.startsWith("#")) {
            const name = key.slice(1);
            if (!isEnvVar(name)) continue;
            // Don't overwrite an active (non-commented) entry
            if (vars[name] && !vars[name].commented) {
                // Append as alternatives
                const values = Array.isArray(value) ? value.map(String) : [String(value)];
                vars[name].alternatives.push(...values);
            } else {
                const values = Array.isArray(value) ? value.map(String) : [String(value)];
                vars[name] = { value: values[0], commented: true, alternatives: values.slice(1) };
            }
        } else if (isEnvVar(key)) {
            // Preserve existing alternatives from a previously parsed "#KEY"
            const existing = vars[key];
            vars[key] = {
                value: String(value),
                commented: false,
                alternatives: existing ? [existing.value, ...existing.alternatives] : [],
            };
        }
    }
    return vars;
}

// ─── Resolve ──────────────────────────────────────────────────

/**
 * Iteratively resolve {{VAR}} templates until stable.
 * Returns a new object with all templates replaced.
 */
function resolveTemplates(vars, maxIterations = 10) {
    const resolved = { ...vars };
    for (let i = 0; i < maxIterations; i++) {
        let changed = false;
        for (const [key, value] of Object.entries(resolved)) {
            const next = value.replace(/\{\{(\w+)\}\}/g, (match, name) =>
                resolved[name] !== undefined ? resolved[name] : match,
            );
            if (next !== value) {
                resolved[key] = next;
                changed = true;
            }
        }
        if (!changed) break;
    }
    return resolved;
}

// ─── Generate ─────────────────────────────────────────────────

/**
 * Generate .env content for one environment.
 *
 * Steps:
 * 1. Merge globalEnvConfig + envConfig (env overrides global)
 * 2. Build flat var map (non-commented only) for template resolution
 * 3. Resolve templates iteratively
 * 4. Resolve commented vars in their own extended context
 * 5. Format output grouped by settings.groups order
 */
function generateEnv(env, settings, globalEnvConfig, envSpecific) {
    const excludeSet = new Set(Array.isArray(envSpecific.EXCLUDE) ? envSpecific.EXCLUDE : []);

    // 1. Merge vars per group
    const groupVars = {};
    for (const groupName of Object.keys(settings.groups)) {
        const globalGroup = globalEnvConfig[groupName] || {};
        const envGroup = envSpecific[groupName] || {};
        const merged = { ...extractVars(globalGroup), ...extractVars(envGroup) };
        if (Object.keys(merged).length > 0) groupVars[groupName] = merged;
    }

    // 2. Build flat context (non-commented vars only)
    const context = { ENV: env, projectName: settings.projectName };
    for (const vars of Object.values(groupVars)) {
        for (const [name, entry] of Object.entries(vars)) {
            if (!entry.commented) context[name] = entry.value;
        }
    }

    // 3. Resolve non-commented templates
    const resolved = resolveTemplates(context);

    // 4. Resolve commented vars + alternatives (add them to context, then resolve)
    const commentedContext = { ...resolved };
    for (const vars of Object.values(groupVars)) {
        for (const [name, entry] of Object.entries(vars)) {
            if (entry.commented) commentedContext[name] = entry.value;
        }
    }
    const resolvedCommented = resolveTemplates(commentedContext);

    // 5. Format output
    const envDescription = settings.envs[env] || "";
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);

    const lines = [
        `# ⚠️  Auto-generated file — do not edit manually`,
        `# Edit env/env.config.json then run: node scripts/generate-env.mjs`,
        `#`,
        `# Environment: ${env}${envDescription ? ` — ${envDescription}` : ""}`,
        `# Generated: ${date} at ${time}`,
        "",
    ];

    for (const [groupName, groupDef] of Object.entries(settings.groups)) {
        const vars = groupVars[groupName];
        if (!vars) continue;

        const outputLines = [];
        for (const varName of groupDef.variables) {
            if (excludeSet.has(varName)) continue;

            const entry = vars[varName];
            if (!entry) continue;

            const value = entry.commented ? resolvedCommented[varName] : resolved[varName];
            if (value === undefined || value.includes("{{")) continue;

            const formatted = formatVar(varName, value);
            outputLines.push(entry.commented ? `# ${formatted}` : formatted);

            // Append commented alternatives
            for (const alt of entry.alternatives) {
                const resolvedAlt = Object.entries(resolvedCommented).reduce(
                    (s, [k, v]) => s.replace(`{{${k}}}`, v),
                    alt,
                );
                if (!resolvedAlt.includes("{{")) {
                    outputLines.push(`# ${formatVar(varName, resolvedAlt)}`);
                }
            }
        }

        if (outputLines.length > 0) {
            lines.push(`# ${groupDef.comment}`);
            lines.push(...outputLines);
            lines.push("");
        }
    }

    return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────

export async function generate() {
    if (!existsSync(CONFIG_PATH)) {
        console.error(red("\nError: env/env.config.mjs not found"));
        console.error(yellow("Run 'node scripts/setup-env.mjs' first to create it.\n"));
        process.exit(1);
    }

    const { default: config } = await import(CONFIG_PATH);
    const { settings, globalEnvConfig, envConfig } = config;
    const envList = Object.keys(settings.envs);

    console.log("\n🔧 Generating environment files...");

    for (const env of envList) {
        const filePath = env === "dev" ? join(ROOT, ".env") : join(ENV_DIR, `.env.${env}`);
        const content = generateEnv(env, settings, globalEnvConfig, envConfig[env]);
        writeFileSync(filePath, content, "utf-8");
        console.log(`${green("✓")} ${relative(ROOT, filePath)}`);
    }

    console.log(green("✅ All environment files generated!\n"));
}

// Run if called directly
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) await generate();
