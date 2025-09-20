"use client";

import { useContext } from "react";
import { ThemeContext } from "./themeContext";
import { UseTheme } from "./themeUtils";

export default function useTheme(): UseTheme {
    return useContext(ThemeContext);
}
