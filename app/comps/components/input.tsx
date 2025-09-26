"use client";

import Input from "@comps/UI/input/input";
import { useState } from "react";

type InputSectionProps = {
    className?: string;
};

export default function InputSection(props: InputSectionProps) {
    const { className } = props;

    // Input
    const [name, setName] = useState("");

    return (
        <section className={className}>
            <h2 className="border-gray-middle border-b pb-2 text-2xl font-bold">Fields</h2>
            <Input label="Input" setValue={setName} value={name} autoComplete="name" />
        </section>
    );
}
