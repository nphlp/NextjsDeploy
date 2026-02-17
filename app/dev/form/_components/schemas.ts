import z from "zod";

export { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";

export const phoneSchema = z
    .string()
    .regex(/^0\d( \d{2}){4}$/, "Tappez deux chiffres puis un espaces (ex: 06 12 34 56 78)");

export const phoneSchemaProgressive = z
    .string("Tappez deux chiffres puis un espaces (ex: 06 12 34 56 78)")
    .refine((val) => {
        const start = /^0\d? ?$/;
        const firstPair = /^0\d \d{1,2} ?$/;
        const secondPair = /^0\d \d{2} \d{1,2} ?$/;
        const thirdPair = /^0\d( \d{2}){2} \d{1,2} ?$/;
        const fourthPair = /^0\d( \d{2}){3} \d{1,2}$/;
        const fullPhone = /^0\d( \d{2}){4}$/;

        return (
            start.test(val) ||
            firstPair.test(val) ||
            secondPair.test(val) ||
            thirdPair.test(val) ||
            fourthPair.test(val) ||
            fullPhone.test(val)
        );
    }, "Tappez deux chiffres puis un espaces (ex: 06 12 34 56 78)");
