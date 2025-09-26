"use client";

import Input from "@comps/UI/input/input";
import { useState } from "react";

type InputSectionProps = {
    className?: string;
};

export default function InputSection(props: InputSectionProps) {
    const { className } = props;

    const [name, setName] = useState("");

    return (
        <section className={className}>
            <Input label="Input" setValue={setName} value={name} autoComplete="name" />
        </section>
    );
}
