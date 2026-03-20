"use client";

import Button from "@atoms/button";
import {
    ChipsContainer,
    ChipsInput,
    Clear,
    Input as ComboboxInput,
    Item as ComboboxItem,
    List as ComboboxList,
    Popup as ComboboxPopup,
    Portal as ComboboxPortal,
    Positioner as ComboboxPositioner,
    Trigger as ComboboxTrigger,
    Value as ComboboxValue,
    Empty,
    ItemIndicator,
    MultipleChip,
    MultipleChipRemove,
} from "@atoms/combobox";
import {
    FormCombobox,
    FormComboboxMultiple,
    FormInput,
    FormSelect,
    FormSelectMultiple,
    FormSwitch,
    FormTextArea,
} from "@atoms/form/_adapters";
import { Field, RequiredNote } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import {
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
import { useToast } from "@atoms/toast";
import { timeout } from "@utils/timout";
import { useRef, useState } from "react";
import { z } from "zod";
import { phoneSchema, phoneSchemaProgressive } from "./schemas";

const cities = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Lille", "Nice", "Nantes", "Strasbourg"];
const skillsList = ["React", "TypeScript", "Node.js", "Python", "Go", "Rust", "SQL", "Docker", "Kubernetes"];

const groupPlaceholder = "Choisir un groupe";
const groupItems: ItemType = { family: "Famille", friends: "Amis", work: "Travail" };

const interestsPlaceholder = "Choisir des intérêts";
const interestItems: ItemType = { sport: "Sport", music: "Musique", travel: "Voyage" };

export default function FormContact() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const skillsChipsRef = useRef<HTMLDivElement>(null);

    const { register, submit, reset } = useForm({
        phone: {
            schema: phoneSchema,
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
            schema: z.array(z.string()).min(1, "Sélectionnez au moins un intérêt"),
            setter: (value: string[]) => value,
            defaultValue: [],
        },
        city: {
            schema: z.string("Sélectionnez une ville").min(1, "Sélectionnez une ville"),
            setter: (value: string | null) => value,
            defaultValue: null,
        },
        skills: {
            schema: z.array(z.string()).min(1, "Sélectionnez au moins une compétence"),
            setter: (value: string[]) => value,
            defaultValue: [],
        },
        bio: {
            schema: z.string().max(500, "Max 500 caractères"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        notifications: {
            schema: z.boolean(),
            setter: (value: boolean) => value,
            defaultValue: true,
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
            await timeout(1000);

            // Toast success
            toast.add({
                title: "Contact ajouté",
                description: `Ville: ${values.city}, Compétences: ${values.skills.join(", ")}`,
                type: "success",
            });

            // Redirect if needed
            // router.push("/contacts");

            // Reset form
            reset();
        } catch {
            // Toast error
            toast.add({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout du contact.",
                type: "error",
            });
        }

        // Stop loader
        setIsLoading(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <Field name="phone" label="Téléphone" description="Validation progressive" disabled={isLoading} required>
                <FormInput name="phone" placeholder="06 12 34 56 78" />
            </Field>

            <Field name="group" label="Groupe" description="Select simple" disabled={isLoading} required>
                <FormSelect name="group">
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
                </FormSelect>
            </Field>

            <Field name="interests" label="Intérêts" description="Select multiple" disabled={isLoading} required>
                <FormSelectMultiple name="interests">
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
                </FormSelectMultiple>
            </Field>

            <Field name="city" label="Ville" description="Combobox simple" disabled={isLoading} required>
                <FormCombobox name="city" items={cities}>
                    <div className="relative w-full">
                        <ComboboxInput placeholder="Rechercher une ville..." className="w-full" />
                        <div className="absolute right-2 bottom-0 flex h-10 items-center">
                            <Clear />
                            <ComboboxTrigger />
                        </div>
                    </div>
                    <ComboboxPortal>
                        <ComboboxPositioner>
                            <ComboboxPopup>
                                <Empty />
                                <ComboboxList>
                                    {(item: string) => (
                                        <ComboboxItem key={item} value={item}>
                                            <ItemIndicator />
                                            <span className="col-start-2">{item}</span>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxPopup>
                        </ComboboxPositioner>
                    </ComboboxPortal>
                </FormCombobox>
            </Field>

            <Field name="skills" label="Compétences" description="Combobox multiple" disabled={isLoading} required>
                <FormComboboxMultiple name="skills" items={skillsList}>
                    <ChipsContainer className="w-full" ref={skillsChipsRef}>
                        <ComboboxValue>
                            {(value: string[]) => (
                                <>
                                    {value.map((skill) => (
                                        <MultipleChip key={skill}>
                                            {skill}
                                            <MultipleChipRemove />
                                        </MultipleChip>
                                    ))}
                                    <ChipsInput placeholder={value.length > 0 ? "" : "Rechercher..."} />
                                </>
                            )}
                        </ComboboxValue>
                    </ChipsContainer>
                    <ComboboxPortal>
                        <ComboboxPositioner anchor={skillsChipsRef}>
                            <ComboboxPopup>
                                <Empty />
                                <ComboboxList>
                                    {(item: string) => (
                                        <ComboboxItem key={item} value={item}>
                                            <ItemIndicator />
                                            <span className="col-start-2">{item}</span>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxPopup>
                        </ComboboxPositioner>
                    </ComboboxPortal>
                </FormComboboxMultiple>
            </Field>

            <Field name="bio" label="Bio" description="Textarea (max 500)" disabled={isLoading}>
                <FormTextArea name="bio" placeholder="Quelques mots..." />
            </Field>

            <Field name="notifications" disabled={isLoading}>
                <FormSwitch name="notifications" label="Activer les notifications" />
            </Field>

            <RequiredNote />

            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="Ajouter le contact"
                    colors="solid"
                    loading={isLoading}
                    className="w-full"
                />
            </div>
        </Form>
    );
}
