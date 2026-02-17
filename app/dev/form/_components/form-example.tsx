"use client";

import Button from "@atoms/button";
import { Field, RequiredNote } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import TextArea from "@atoms/input/text-area";
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
import SelectMultiple from "@atoms/select/select-multiple";
import { useToast } from "@atoms/toast";
import { timeout } from "@utils/timout";
import { useState } from "react";
import { z } from "zod";
import { emailSchema, emailSchemaProgressive, phoneSchema, phoneSchemaProgressive } from "./schemas";

type CreateContactProps = {
    name: string;
    email: string;
    phone: string;
    bio: string;
    group: string;
    interests: string[];
};

const createNewContact = async (props: CreateContactProps) => {
    const { name, email, phone, bio, group, interests } = props;

    // Fake timeout to simulate async operation
    timeout(2000);

    return `${name} a été ajouté à vos contacts.\nEmail : ${email}\nTéléphone : ${phone}\nBio : ${bio || "Aucune"}\nGroupe : ${group}\nIntérêts : ${interests.join(", ")}`;
};

export default function FormExample() {
    // const router = useRouter();
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const { register, submit, reset } = useForm({
        name: {
            schema: z
                .string()
                .min(1, "Le champs est requis")
                .refine((val) => !/\d/.test(val), "Les nombres sont interdits"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        email: {
            // Strict email validation onSubmit & onBlur
            schema: emailSchema,
            // Override : progressive validation while user is typing
            // "john" -> "john.doe" -> "john.doe@example" -> "john.doe@example.com"
            onChangeSchema: emailSchemaProgressive,
            setter: (value: string) => value,
            defaultValue: "",
        },
        phone: {
            // Strict phone validation onSubmit & onBlur
            schema: phoneSchema,
            // Override : progressive validation while user is typing
            // "06" -> "06 12 3" -> "06 12 34 5" -> "06 12 34 56 78"
            onChangeSchema: phoneSchemaProgressive,
            setter: (value: string) => value,
            defaultValue: "",
        },
        group: {
            schema: z.string("Sélectionnez un groupe"),
            setter: (value: string | null) => value,
            defaultValue: null,
        },
        interests: {
            schema: z.array(z.string()).min(1, "Sélectionnez une ou plusieurs options"),
            setter: (value: string[]) => value,
            defaultValue: [],
        },
        bio: {
            schema: z.string().max(500, "La bio ne doit pas dépasser 500 caractères"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const values = submit();

        // Cancel if validation fails
        if (!values) return;

        // Set loader after validation
        setIsLoading(true);

        try {
            // Async submission
            const message = await createNewContact(values);

            // Toast success
            toast.add({
                title: "Nouveau contact",
                description: message,
                type: "success",
            });

            // Redirect if needed
            // router.push("/success");

            // Reset form
            reset();
        } catch {
            // Toast error
            toast.add({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'inscription du nouveau contact.",
                type: "error",
            });
        }

        // Stop loader
        setIsLoading(false);
    };

    const groupPlaceholder = "Choisir un groupe";

    const groupItems: ItemType = {
        family: "Famille",
        friends: "Amis",
        work: "Travail",
    };

    const interestsPlaceholder = "Choisir des centres d'intérêts";

    const interestItems: ItemType = {
        sport: "Sport",
        music: "Musique",
        travel: "Voyage",
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <Field name="name" label="Nom" description="Entrez votre prénom" disabled={isLoading} required>
                <Input name="name" placeholder="John Doe" useForm />
            </Field>

            <Field name="email" label="Email" description="Entrez votre adresse email" disabled={isLoading} required>
                <Input name="email" placeholder="john.doe@example.com" useForm />
            </Field>

            <Field
                name="phone"
                label="Téléphone"
                description="Entrez votre numéro de téléphone"
                disabled={isLoading}
                required
            >
                <Input name="phone" placeholder="06 12 34 56 78" useForm />
            </Field>

            <Field name="group" label="Groupe" description="Sélectionnez un groupe" disabled={isLoading} required>
                <Select name="group" useForm>
                    <Trigger className="w-full max-w-full">
                        <Value>
                            {(value) => renderValue({ placeholder: groupPlaceholder, value, items: groupItems })}
                        </Value>
                    </Trigger>

                    <Portal>
                        <Positioner>
                            <Popup withScrollArrows>
                                <List>
                                    <Placeholder label={groupPlaceholder} />
                                    <Item label="Famille" itemKey="family" />
                                    <Item label="Amis" itemKey="friends" />
                                    <Item label="Travail" itemKey="work" />
                                </List>
                            </Popup>
                        </Positioner>
                    </Portal>
                </Select>
            </Field>

            <Field
                name="interests"
                label="Intérêts"
                description="Sélectionnez vos intérêts"
                disabled={isLoading}
                required
            >
                <SelectMultiple name="interests" useForm>
                    <Trigger className="w-full max-w-full">
                        <Value>
                            {(value) => renderValue({ placeholder: interestsPlaceholder, value, items: interestItems })}
                        </Value>
                    </Trigger>

                    <Portal>
                        <Positioner>
                            <Popup withScrollArrows>
                                <List>
                                    <Item label="Sport" itemKey="sport" />
                                    <Item label="Musique" itemKey="music" />
                                    <Item label="Voyage" itemKey="travel" />
                                </List>
                            </Popup>
                        </Positioner>
                    </Portal>
                </SelectMultiple>
            </Field>

            <Field
                name="bio"
                label="Bio"
                description="Présentez votre contact en quelques mots (max 500 caractères)"
                disabled={isLoading}
            >
                <TextArea name="bio" placeholder="Quelques mots sur ce contact..." useForm />
            </Field>

            <RequiredNote />

            {/* Submit */}
            <div className="flex justify-center">
                <Button type="submit" label="Envoyer" loading={isLoading} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}
