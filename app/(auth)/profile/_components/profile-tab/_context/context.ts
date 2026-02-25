import { SessionList } from "@lib/auth-server";
import { Dispatch, SetStateAction, createContext } from "react";

export type ContextType = {
    sessions: SessionList;
    setSessions: Dispatch<SetStateAction<SessionList>>;
    isRevokeAllOpen: boolean;
    setIsRevokeAllOpen: Dispatch<SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({} as ContextType);
