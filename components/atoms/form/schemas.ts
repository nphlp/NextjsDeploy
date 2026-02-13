import z from "zod";

// ─── Name (firstname, lastname) ──────────────────────────────────────

export const nameSchema = z
    .string()
    .min(1, "Le champ est requis")
    .max(100, "Maximum 100 caractères")
    .regex(/^[\p{L}\s'-]+$/u, "Lettres, espaces, apostrophes et tirets uniquement");

// ─── Email ───────────────────────────────────────────────────────────

export const emailSchema = z
    .string()
    .min(1, "Le champs est requis")
    .refine((val) => z.email().safeParse(val).success, "L'email est invalide");

export const emailSchemaProgressive = z
    .string()
    .min(1, "Le champs est requis")
    .refine((val) => {
        const local = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]$/i;
        const localAt = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@$/i;
        const localAtDomain = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@[a-z0-9][a-z0-9\-]*$/i;
        const localAtDomainDot = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+$/i;
        const localAtDomainDotTld = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]*$/i;
        const fullEmail = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

        return (
            local.test(val) ||
            localAt.test(val) ||
            localAtDomain.test(val) ||
            localAtDomainDot.test(val) ||
            localAtDomainDotTld.test(val) ||
            fullEmail.test(val)
        );
    }, "L'email est invalide");

// ─── Password ────────────────────────────────────────────────────────

export const passwordSchema = z
    .string()
    .regex(/[a-z]/, "Au moins 1 minuscule requise")
    .regex(/[A-Z]/, "Au moins 1 majuscule requise")
    .regex(/[0-9]/, "Au moins 1 nombre requis")
    .regex(/[^a-zA-Z0-9]/, "Au moins 1 caractère spécial requis")
    .min(14, "Minimum 14 caractères")
    .max(128, "Maximum 128 caractères");

export const passwordSchemaOnChange = z.string().min(1, "Le champ est requis").max(128, "Maximum 128 caractères");

export const passwordSchemaOnBlur = z
    .string()
    .min(1, "Le champ est requis")
    .regex(/[a-z]/, "Veillez remplir tous les critères de sécurité")
    .regex(/[A-Z]/, "Veillez remplir tous les critères de sécurité")
    .regex(/[0-9]/, "Veillez remplir tous les critères de sécurité")
    .regex(/[^a-zA-Z0-9]/, "Veillez remplir tous les critères de sécurité")
    .min(14, "Veillez remplir tous les critères de sécurité")
    .max(128, "Maximum 128 caractères");
