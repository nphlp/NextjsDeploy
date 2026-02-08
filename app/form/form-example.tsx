"use client";

import Button from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import Select, {
    Item,
    ItemType,
    List,
    Placeholder,
    Popup,
    Portal,
    Positioner,
    Trigger,
    Value,
    renderValue,
} from "@atoms/select";
import { z } from "zod";

const schema = z.object({
    firstname: z
        .string()
        .min(3, "Minimum 3 caractères")
        .refine((val) => !/\d/.test(val), "Les nombres sont interdits"),
    lastname: z
        .string()
        .min(3, "Minimum 3 caractères")
        .refine((val) => !/\d/.test(val), "Les nombres sont interdits"),
    phone: z.string().regex(/^0\d( \d{2}){4}$/, "Format attendu : 06 12 34 56 78"),
    category: z.string("Sélectionnez une option").min(1, "Sélectionnez une option"),
});

const validate = fieldValidator(schema);

export default function FormExample() {
    const items: ItemType = {
        family: "Famille",
        friends: "Amis",
        work: "Travail",
    };

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = schema.safeParse(formValues);

        if (!result.success) return;

        alert(JSON.stringify(result.data, null, 2));
    };

    return (
        <Form onFormSubmit={handleSubmit}>
            <Field
                label="Prénom"
                name="firstname"
                description="Entrez votre prénom"
                validate={validate("firstname")}
                validationMode="onChange"
            >
                <Control placeholder="Bertand" render={<Input />} />
            </Field>

            <Field
                label="Nom de famille"
                name="lastname"
                description="Entrez votre nom de famille"
                validate={validate("lastname")}
                validationMode="onChange"
            >
                <Control placeholder="André" render={<Input />} />
            </Field>

            <Field
                label="Téléphone"
                name="phone"
                description="Entrez votre numéro de téléphone"
                validate={validate("phone")}
                validationMode="onChange"
            >
                <Control placeholder="06 12 34 56 78" render={<Input />} />
            </Field>

            <Field
                label="Catégorie"
                name="category"
                description="Choisissez une catégorie"
                validate={validate("category")}
                validationMode="onChange"
            >
                <Control
                    render={
                        <Select>
                            <Trigger className="w-full max-w-full">
                                <Value>{(value) => renderValue({ placeholder: "Groupe", value, items })}</Value>
                            </Trigger>

                            <Portal>
                                <Positioner alignItemWithTrigger>
                                    <Popup withScrollArrows>
                                        <List>
                                            <Placeholder label="Groupe" />
                                            <Item label="Famille" itemKey="family" />
                                            <Item label="Amis" itemKey="friends" />
                                            <Item label="Travail" itemKey="work" />
                                        </List>
                                    </Popup>
                                </Positioner>
                            </Portal>
                        </Select>
                    }
                />
            </Field>

            {/* Submit */}
            <div className="flex justify-center">
                <Button type="submit" label="Envoyer" className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
