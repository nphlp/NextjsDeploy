"use client";

import Button from "@comps/UI/button/button";
import { useComboboxMultiStates, useComboboxStates } from "@comps/UI/comboboxes/comboHookStates";
import Combobox from "@comps/UI/comboboxes/combobox";
import ComboboxMulti from "@comps/UI/comboboxes/comboboxMulti";
import { ComboOptionType, MultiSourceComboOptionType } from "@comps/UI/comboboxes/utils";
import Feedback, { FeedbackType } from "@comps/UI/feedback";
import Input from "@comps/UI/input/input";
import InputImage from "@comps/UI/inputImage";
import Select from "@comps/UI/select/select";
import { SelectOptionType } from "@comps/UI/select/utils";
import { FormEvent, useState } from "react";

type FormProps = {
    userList: SelectOptionType[];
    taskList: ComboOptionType[];
    accountList: MultiSourceComboOptionType[];
};

export default function Form(props: FormProps) {
    const { userList, taskList, accountList } = props;

    // State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const comboboxStates = useComboboxStates(null, taskList);
    const comboboxMultiStates = useComboboxMultiStates([], accountList);

    // Feedback
    const [feedback, setFeedback] = useState<FeedbackType>();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Loading
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Print all states
        console.log({
            input: name,
            select: category,
            combobox: comboboxStates.selected?.slug,
            comboboxMulti: comboboxMultiStates.selected.map((option) => option.slug),
            inputImage: image?.name,
        });

        // Set feedback
        setFeedback({ message: "Formulaire envoyé avec succès", mode: "success" });
        setIsFeedbackOpen(true);

        // Reset loading
        setIsLoading(false);

        // Wait for feedback reset
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Reset feedback
        setIsFeedbackOpen(false);
    };

    return (
        <form className="flex flex-col items-center justify-center gap-4" onSubmit={handleSubmit}>
            <Input
                label="Nom"
                placeholder="Entrez votre nom"
                setValue={setName}
                value={name}
                className={{ component: "w-full" }}
                required={false}
                autoComplete="name"
            />
            <Select
                label="Catégorie"
                placeholder="Sélectionnez une catégorie"
                options={userList}
                setSelected={setCategory}
                selected={category}
                className={{ component: "w-full" }}
                // canNotBeEmpty
            />
            <Combobox
                label="Un seul article"
                placeholder="Recherchez un article"
                classComponent="w-full"
                initialOptions={taskList}
                states={comboboxStates}
            />
            <ComboboxMulti
                label="Liste de produits"
                placeholder="Recherchez plusieurs produits"
                classComponent="w-full"
                initialOptions={accountList}
                states={comboboxMultiStates}
            />
            <InputImage
                label="Image"
                onChange={setImage}
                imagePreview={image}
                classComponent="w-full"
                required={false}
            />
            <Feedback feedback={feedback} isFeedbackOpen={isFeedbackOpen} />
            <div className="flex justify-center">
                <Button type="submit" label="Envoyer" isLoading={isLoading} />
            </div>
        </form>
    );
}
