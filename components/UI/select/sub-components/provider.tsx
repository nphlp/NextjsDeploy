import { ReactNode, useRef, useState } from "react";
import { CommonProps } from "../select";
import { Context } from "./context";

// Provider
type ProviderProps = CommonProps & {
    children: ReactNode;
};

const Provider = (props: ProviderProps) => {
    const { children, ...others } = props;

    // Internal States
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionListRef = useRef<HTMLDivElement>(null);

    // Context value
    const value = { ...others, isOpen, setIsOpen, buttonRef, optionListRef };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
