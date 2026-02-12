import z from "zod";

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
