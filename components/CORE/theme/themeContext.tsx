"use client";

import { createContext } from "react";
import { UseTheme } from "./themeUtils";

export type ContextType = UseTheme;

const initialContextData: ContextType = {} as ContextType;

export const Context = createContext<ContextType>(initialContextData);
