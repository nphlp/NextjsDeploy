"use client";

import { createContext } from "react";
import { UseTheme } from "./theme-utils";

export type ThemeContextType = UseTheme;

const initialContextData: ThemeContextType = {} as ThemeContextType;

export const ThemeContext = createContext<ThemeContextType>(initialContextData);
