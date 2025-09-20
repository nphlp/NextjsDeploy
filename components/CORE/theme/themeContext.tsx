"use client";

import { createContext } from "react";
import { UseTheme } from "./themeUtils";

export type ThemeContextType = UseTheme;

const initialContextData: ThemeContextType = {} as ThemeContextType;

export const ThemeContext = createContext<ThemeContextType>(initialContextData);
