"use client";

import { useComboboxMultiStates, useComboboxStates } from "@comps/UI/comboboxes/comboHookStates";
import Combobox from "@comps/UI/comboboxes/combobox";
import ComboboxMulti from "@comps/UI/comboboxes/comboboxMulti";
import { ComboOptionType, MultiSourceComboOptionType } from "@comps/UI/comboboxes/utils";
import Input from "@comps/UI/input/input";
import InputImage from "@comps/UI/inputImage";
import InputPassword from "@comps/UI/inputPassword";
import Select from "@comps/UI/select/select";
import { SelectOptionType } from "@comps/UI/select/utils";
import { useState } from "react";

type InputSectionProps = {
    initialData: {
        taskSelectOptions: SelectOptionType[];
        userComboOptions: ComboOptionType[];
        mergedMultiComboOptions: MultiSourceComboOptionType[];
    };
    className?: string;
};

export default function InputSection(props: InputSectionProps) {
    const { initialData, className } = props;
    const { taskSelectOptions, userComboOptions, mergedMultiComboOptions } = initialData;

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [task, setTask] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const comboboxStates = useComboboxStates(null, userComboOptions);
    const comboboxMultiStates = useComboboxMultiStates([], mergedMultiComboOptions);

    return (
        <section className={className}>
            <h2 className="border-gray-middle border-b pb-2 text-2xl font-bold">Fields</h2>
            <Input label="Input" placeholder="Entrez votre nom" setValue={setName} value={name} autoComplete="name" />
            <InputPassword
                label="Mot de passe"
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
                setValue={setPassword}
                value={password}
            />
            <Select
                label="Catégorie"
                placeholder="Sélectionnez une catégorie"
                options={taskSelectOptions}
                setSelected={setTask}
                selected={task}
                className={{ component: "w-full" }}
                canNotBeEmpty
            />
            <Combobox
                label="Un seul article"
                placeholder="Recherchez un article"
                classComponent="w-full"
                initialOptions={userComboOptions}
                states={comboboxStates}
            />
            <ComboboxMulti
                label="Liste de produits"
                placeholder="Recherchez plusieurs produits"
                classComponent="w-full"
                initialOptions={mergedMultiComboOptions}
                states={comboboxMultiStates}
                displaySelectedValuesInDropdown
            />
            <InputImage
                label="Image"
                onChange={setImage}
                imagePreview={image}
                classComponent="w-full"
                required={false}
            />
        </section>
    );
}
