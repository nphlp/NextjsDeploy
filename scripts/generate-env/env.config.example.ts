/**
 * Configuration des variables d'environnement
 *
 * Ce fichier est versionné et sert d'exemple.
 * Copier vers env/env.config.ts et remplir les valeurs sensibles.
 *
 * Génération des fichiers .env : make generate-env
 */
import type { EnvsConfig, GlobalConfig, SettingsShape } from "./env.types";
import { commented, template } from "./env.types";

// Settings
const settings = {
    projectName: "nextjs-deploy",

    envs: {
        dev: "Local development environment",
        basic: "Local containerized environment",
        experiment: "VPS experiment environment",
        preview: "VPS preview environment",
        production: "VPS production environment",
    },

    groups: {
        node: {
            comment: "Node.js environment",
            variables: ["NODE_ENV"],
        },
        label: {
            comment: "Environment label",
            variables: ["ENV_LABEL"],
        },
        nextjs: {
            comment: "Next.js configuration",
            variables: ["NEXTJS_STANDALONE", "NEXT_PUBLIC_BASE_URL"],
        },
        vps: {
            comment: "VPS domains",
            variables: ["VPS_NEXTJS_DOMAIN", "VPS_PRISMA_STUDIO_DOMAIN"],
        },
        postgres: {
            comment: "PostgreSQL database",
            variables: ["POSTGRES_HOST", "POSTGRES_PORT", "POSTGRES_DB", "POSTGRES_PASSWORD"],
        },
        prisma: {
            comment: "Prisma database connection",
            variables: ["DATABASE_URL"],
        },
        betterAuth: {
            comment: "Better Auth configuration",
            variables: ["BETTER_AUTH_SECRET"],
        },
        smtp: {
            comment: "SMTP configuration",
            variables: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM", "SMTP_FROM_NAME"],
        },
        prismaStudio: {
            comment: "Prisma Studio authentication",
            variables: ["PRISMA_STUDIO_AUTH"],
        },
        tunnelling: {
            comment: "Ngrok tunnelling (optional)",
            variables: ["NGROK_URL", "NEXT_PUBLIC_BASE_URL"],
        },
        ide: {
            comment: "IDE configuration",
            variables: ["REACT_EDITOR"],
        },
    },
} as const satisfies SettingsShape;

type Settings = typeof settings;

// Global Config
const globalConfig: GlobalConfig<Settings> = {
    node: {
        NODE_ENV: "production",
    },
    nextjs: {
        NEXTJS_STANDALONE: true,
    },
    postgres: {
        POSTGRES_PORT: 5432,
        POSTGRES_DB: "nextjs-deploy-db",
    },
    smtp: {
        SMTP_FROM: "hello@domain.com",
        SMTP_HOST: "smtp.hostinger.com",
        SMTP_PORT: 465,
        SMTP_USER: "hello@domain.com",
        SMTP_PASSWORD: "",
    },
    prismaStudio: {
        // Prisma Studio authentication
        // 1. Generate hashed password with `htpasswd -nbB admin your-password-here`
        // 2. Double the `$` signs for `compose.yml` files
        // 3. Copy the result here
        PRISMA_STUDIO_AUTH: "admin:$$apr1$$xxxxxxxx$$xxxxxxxxxxxxxxxxxxxx",
    },
} as const;

// Env Config
const envConfig: EnvsConfig<Settings> = {
    dev: {
        node: {
            NODE_ENV: "development",
        },
        label: {
            ENV_LABEL: template("{{ENV}}-{{projectName}}"),
        },
        nextjs: {
            NEXTJS_STANDALONE: false,
            NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
        },
        postgres: {
            POSTGRES_HOST: "localhost",
            POSTGRES_PORT: 5433,
            POSTGRES_PASSWORD: "nextjs-deploy-password",
        },
        prisma: {
            DATABASE_URL: template(
                "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            ),
        },
        betterAuth: {
            BETTER_AUTH_SECRET: "better-auth-session-encryption-key",
        },
        smtp: {
            SMTP_FROM_NAME: template("Nextjs Deploy ({{ENV}})"),
        },
        tunnelling: {
            NGROK_URL: commented("my-free-domain.ngrok-free.app"),
            NEXT_PUBLIC_BASE_URL: commented(template("https://{{NGROK_URL}}")),
        },
        ide: {
            REACT_EDITOR: "code",
        },
        EXCLUDE: ["VPS_NEXTJS_DOMAIN", "VPS_PRISMA_STUDIO_DOMAIN", "PRISMA_STUDIO_AUTH"],
    },
    basic: {
        label: {
            ENV_LABEL: template("{{ENV}}-{{projectName}}"),
        },
        nextjs: {
            NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
        },
        postgres: {
            POSTGRES_HOST: "postgres",
            POSTGRES_PASSWORD: "nextjs-deploy-password",
        },
        prisma: {
            DATABASE_URL: template(
                "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            ),
        },
        betterAuth: {
            BETTER_AUTH_SECRET: "better-auth-session-encryption-key",
        },
        smtp: {
            SMTP_FROM_NAME: template("Nextjs Deploy ({{ENV}})"),
        },
        EXCLUDE: ["VPS_NEXTJS_DOMAIN", "VPS_PRISMA_STUDIO_DOMAIN"],
    },
    experiment: {
        label: {
            ENV_LABEL: template("{{ENV}}-{{projectName}}"),
        },
        vps: {
            VPS_NEXTJS_DOMAIN: "experiment.domain.com",
            VPS_PRISMA_STUDIO_DOMAIN: template("prisma-studio.{{VPS_NEXTJS_DOMAIN}}"),
        },
        nextjs: {
            NEXT_PUBLIC_BASE_URL: template("https://{{VPS_NEXTJS_DOMAIN}}"),
        },
        postgres: {
            // Generate password with: openssl rand -base64 32
            POSTGRES_HOST: template("postgres-{{ENV_LABEL}}"),
            POSTGRES_PASSWORD: "",
        },
        prisma: {
            DATABASE_URL: template(
                "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            ),
        },
        betterAuth: {
            // Generate secret with: openssl rand -base64 32
            BETTER_AUTH_SECRET: "",
        },
        smtp: {
            SMTP_FROM_NAME: template("Nextjs Deploy ({{ENV}})"),
        },
    },
    preview: {
        label: {
            ENV_LABEL: template("{{ENV}}-{{projectName}}"),
        },
        vps: {
            VPS_NEXTJS_DOMAIN: "preview.domain.com",
            VPS_PRISMA_STUDIO_DOMAIN: template("prisma-studio.{{VPS_NEXTJS_DOMAIN}}"),
        },
        nextjs: {
            NEXT_PUBLIC_BASE_URL: template("https://{{VPS_NEXTJS_DOMAIN}}"),
        },
        postgres: {
            // Generate password with: openssl rand -base64 32
            POSTGRES_HOST: template("postgres-{{ENV_LABEL}}"),
            POSTGRES_PASSWORD: "",
        },
        prisma: {
            DATABASE_URL: template(
                "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            ),
        },
        betterAuth: {
            // Generate secret with: openssl rand -base64 32
            BETTER_AUTH_SECRET: "",
        },
        smtp: {
            SMTP_FROM_NAME: template("Nextjs Deploy ({{ENV}})"),
        },
    },
    production: {
        label: {
            ENV_LABEL: template("{{projectName}}"),
        },
        vps: {
            VPS_NEXTJS_DOMAIN: "domain.com",
            VPS_PRISMA_STUDIO_DOMAIN: template("prisma-studio.{{VPS_NEXTJS_DOMAIN}}"),
        },
        nextjs: {
            NEXT_PUBLIC_BASE_URL: template("https://{{VPS_NEXTJS_DOMAIN}}"),
        },
        postgres: {
            // Generate password with: openssl rand -base64 32
            POSTGRES_HOST: template("postgres-{{ENV_LABEL}}"),
            POSTGRES_PASSWORD: "",
        },
        prisma: {
            DATABASE_URL: template(
                "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            ),
        },
        betterAuth: {
            // Generate secret with: openssl rand -base64 32
            BETTER_AUTH_SECRET: "",
        },
        smtp: {
            SMTP_FROM_NAME: "Nextjs Deploy",
        },
    },
} as const;

// Exports
export { settings, globalConfig, envConfig };
