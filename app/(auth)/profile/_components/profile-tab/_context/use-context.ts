import { useContext } from "react";
import { Context, ContextType } from "./context";

export function useSessionContext(): ContextType {
    const context = useContext(Context);

    if (!context) throw new Error("useContext must be used within a <Provider /> component");

    return context;
}
