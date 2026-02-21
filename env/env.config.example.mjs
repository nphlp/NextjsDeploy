export default {
    settings: {
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
            tunnelling: {
                comment: "Ngrok tunnelling (optional)",
                variables: ["NGROK_URL", "NEXT_PUBLIC_BASE_URL"],
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
            turnstile: {
                comment: "Cloudflare Turnstile captcha",
                variables: ["TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY"],
            },
            smtp: {
                comment: "SMTP configuration",
                variables: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM", "SMTP_FROM_NAME"],
            },
            prismaStudio: {
                comment: "Prisma Studio authentication",
                variables: ["PRISMA_STUDIO_AUTH"],
            },
            umami: {
                comment: "Umami analytics",
                variables: ["UMAMI_URL", "UMAMI_WEBSITE_ID"],
            },
            ide: {
                comment: "IDE configuration",
                variables: ["REACT_EDITOR"],
            },
        },
    },

    globalEnvConfig: {
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
            // TO UPDATE: Get SMTP configuration from your email provider
            SMTP_FROM: "hello@domain.com",
            SMTP_HOST: "smtp.hostinger.com",
            SMTP_PORT: 465,
            // TO UPDATE
            SMTP_USER: "hello@domain.com",
            // TO UPDATE
            SMTP_PASSWORD: "",
        },
        prismaStudio: {
            // TO UPDATE: Generate credentials for basic auth (docs: ./docs/prisma-studio/2-environment-variables.md)
            PRISMA_STUDIO_AUTH: "admin:$$apr1$$xxxxxxxx$$xxxxxxxxxxxxxxxxxxxx",
        },
    },

    envConfig: {
        dev: {
            node: { NODE_ENV: "development" },
            label: { ENV_LABEL: "{{ENV}}-{{projectName}}" },
            nextjs: {
                NEXTJS_STANDALONE: false,
                NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
            },
            tunnelling: {
                // TO UPDATE: Get a ngrok static domain (docs: ./docs/nextjs-deploy/2-environment-variables.md)
                "#NGROK_URL": "my-free-domain.ngrok-free.app",
                "#NEXT_PUBLIC_BASE_URL": "https://{{NGROK_URL}}",
            },
            postgres: {
                POSTGRES_HOST: "localhost",
                POSTGRES_PORT: 5433,
                POSTGRES_PASSWORD: "nextjs-deploy-password",
            },
            prisma: {
                DATABASE_URL:
                    "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            },
            betterAuth: {
                BETTER_AUTH_SECRET: "better-auth-session-encryption-key",
            },
            turnstile: {
                // Secret key
                TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
                // Cloudflare site key
                NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA", // Always pass
                "#NEXT_PUBLIC_TURNSTILE_SITE_KEY": [
                    "2x00000000000000000000AB", // Always blocks
                    "3x00000000000000000000FF", // Forces interactive challenge
                ],
            },
            smtp: {
                // Mailpit (local email testing — http://localhost:8025)
                SMTP_HOST: "localhost",
                SMTP_PORT: 1025,
                SMTP_USER: "mailpit",
                SMTP_PASSWORD: "mailpit",
                // Hostinger (real email sending)
                "#SMTP_HOST": "smtp.hostinger.com",
                "#SMTP_PORT": 465,
                "#SMTP_USER": "hello@domain.com",
                "#SMTP_PASSWORD": "",
                SMTP_FROM_NAME: "Nextjs Deploy ({{ENV}})",
            },
            ide: { REACT_EDITOR: "code" },
            EXCLUDE: [
                "VPS_NEXTJS_DOMAIN",
                "VPS_PRISMA_STUDIO_DOMAIN",
                "PRISMA_STUDIO_AUTH",
                "UMAMI_URL",
                "UMAMI_WEBSITE_ID",
            ],
        },

        basic: {
            label: { ENV_LABEL: "{{ENV}}-{{projectName}}" },
            nextjs: {
                NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
            },
            postgres: {
                POSTGRES_HOST: "postgres",
                POSTGRES_PASSWORD: "nextjs-deploy-password",
            },
            prisma: {
                DATABASE_URL:
                    "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            },
            betterAuth: {
                BETTER_AUTH_SECRET: "better-auth-session-encryption-key",
            },
            turnstile: {
                // Secret key
                TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
                // Cloudflare site key
                NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA", // Always pass
                "#NEXT_PUBLIC_TURNSTILE_SITE_KEY": [
                    "2x00000000000000000000AB", // Always blocks
                    "3x00000000000000000000FF", // Forces interactive challenge
                ],
            },
            smtp: {
                SMTP_FROM_NAME: "Nextjs Deploy ({{ENV}})",
            },
            EXCLUDE: ["VPS_NEXTJS_DOMAIN", "VPS_PRISMA_STUDIO_DOMAIN", "UMAMI_URL", "UMAMI_WEBSITE_ID"],
        },

        experiment: {
            label: { ENV_LABEL: "{{ENV}}-{{projectName}}" },
            vps: {
                // TO UPDATE
                VPS_NEXTJS_DOMAIN: "experiment.domain.com",
                VPS_PRISMA_STUDIO_DOMAIN: "prisma-studio.{{VPS_NEXTJS_DOMAIN}}",
            },
            nextjs: {
                NEXT_PUBLIC_BASE_URL: "https://{{VPS_NEXTJS_DOMAIN}}",
            },
            postgres: {
                POSTGRES_HOST: "postgres-{{ENV_LABEL}}",
                // TO UPDATE: Generate password with: openssl rand -base64 32
                POSTGRES_PASSWORD: "",
            },
            prisma: {
                DATABASE_URL:
                    "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            },
            betterAuth: {
                // TO UPDATE: Generate secret with: openssl rand -base64 32
                BETTER_AUTH_SECRET: "",
            },
            turnstile: {
                // TO UPDATE: Get keys from Cloudflare Dashboard > Turnstile
                NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
                // TO UPDATE
                TURNSTILE_SECRET_KEY: "",
            },
            smtp: {
                SMTP_FROM_NAME: "Nextjs Deploy ({{ENV}})",
            },
            EXCLUDE: ["UMAMI_URL", "UMAMI_WEBSITE_ID"],
        },

        preview: {
            label: { ENV_LABEL: "{{ENV}}-{{projectName}}" },
            vps: {
                // TO UPDATE
                VPS_NEXTJS_DOMAIN: "preview.domain.com",
                VPS_PRISMA_STUDIO_DOMAIN: "prisma-studio.{{VPS_NEXTJS_DOMAIN}}",
            },
            nextjs: {
                NEXT_PUBLIC_BASE_URL: "https://{{VPS_NEXTJS_DOMAIN}}",
            },
            postgres: {
                POSTGRES_HOST: "postgres-{{ENV_LABEL}}",
                // TO UPDATE: Generate password with: openssl rand -base64 32
                POSTGRES_PASSWORD: "",
            },
            prisma: {
                DATABASE_URL:
                    "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            },
            betterAuth: {
                // TO UPDATE: Generate secret with: openssl rand -base64 32
                BETTER_AUTH_SECRET: "",
            },
            turnstile: {
                // TO UPDATE: Get keys from Cloudflare Dashboard > Turnstile
                NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
                // TO UPDATE
                TURNSTILE_SECRET_KEY: "",
            },
            smtp: {
                SMTP_FROM_NAME: "Nextjs Deploy ({{ENV}})",
            },
            EXCLUDE: ["UMAMI_URL", "UMAMI_WEBSITE_ID"],
        },

        production: {
            label: { ENV_LABEL: "{{projectName}}" },
            vps: {
                // TO UPDATE
                VPS_NEXTJS_DOMAIN: "domain.com",
                VPS_PRISMA_STUDIO_DOMAIN: "prisma-studio.{{VPS_NEXTJS_DOMAIN}}",
            },
            nextjs: {
                NEXT_PUBLIC_BASE_URL: "https://{{VPS_NEXTJS_DOMAIN}}",
            },
            postgres: {
                POSTGRES_HOST: "postgres-{{ENV_LABEL}}",
                // TO UPDATE: Generate password with: openssl rand -base64 32
                POSTGRES_PASSWORD: "",
            },
            prisma: {
                DATABASE_URL:
                    "postgres://postgres:{{POSTGRES_PASSWORD}}@{{POSTGRES_HOST}}:{{POSTGRES_PORT}}/{{POSTGRES_DB}}",
            },
            betterAuth: {
                // TO UPDATE: Generate secret with: openssl rand -base64 32
                BETTER_AUTH_SECRET: "",
            },
            turnstile: {
                // TO UPDATE: Get keys from Cloudflare Dashboard > Turnstile
                NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
                // TO UPDATE
                TURNSTILE_SECRET_KEY: "",
            },
            smtp: {
                SMTP_FROM_NAME: "Nextjs Deploy",
            },
            umami: {
                UMAMI_URL: "http://umami:3000",
                // TO UPDATE: Get website ID from Umami dashboard after creating a new website
                UMAMI_WEBSITE_ID: "your-website-id",
            },
        },
    },
};
