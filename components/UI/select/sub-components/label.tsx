import { combo } from "@lib/combo";
import { useContext } from "react";
import { theme } from "../theme";
import { Context } from "./context";

const Label = () => {
    const { variant, className, label, noLabel } = useContext(Context);

    return <div className={combo(theme[variant].label, className?.label, noLabel && "sr-only")}>{label}</div>;
};

export default Label;
