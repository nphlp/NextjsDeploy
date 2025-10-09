"use client";

import { combo } from "@lib/combo";
import { merge } from "lodash";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import Button from "./button/button";
import Input, { InputClassName, InputProps } from "./input/input";

export type ButtonClassName = {
    component?: string;
    input?: InputClassName;
    button?: ButtonClassName;
};

type InputPasswordProps = {
    label: string;
    autoComplete: InputProps["autoComplete"];
    placeholder?: string;
    className?: ButtonClassName;
    setValue: (value: string) => void;
    value: string;
    noLabel?: boolean;
};

export default function InputPassword(props: InputPasswordProps) {
    const { setValue, value, label, placeholder, autoComplete, className, noLabel } = props;

    const [toggleVisibility, setToggleVisibility] = useState(false);

    return (
        <div className={combo("relative flex flex-row items-end gap-1.5", className?.component)}>
            <Input
                label={label}
                placeholder={placeholder}
                autoComplete={autoComplete}
                type={toggleVisibility ? "text" : "password"}
                className={merge({ component: "w-full" }, className?.input)}
                setValue={setValue}
                value={value}
                noLabel={noLabel}
            />
            <Button
                type="button"
                label="toggle-password-visibility"
                className={merge(
                    { button: "hover:border-gray-low absolute right-1.5 bottom-1 p-1" },
                    className?.button,
                )}
                variant="ghost"
                onClick={() => setToggleVisibility(!toggleVisibility)}
            >
                {toggleVisibility && <Eye className="stroke-gray-high size-5" />}
                {!toggleVisibility && <EyeClosed className="stroke-gray-high size-5" />}
            </Button>
        </div>
    );
}
