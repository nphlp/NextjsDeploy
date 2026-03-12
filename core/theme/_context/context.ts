import { createContext } from "react";
import { UseTheme } from "../theme-utils";

export type ThemeContextType = UseTheme;

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);
