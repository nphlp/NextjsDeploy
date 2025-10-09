"use client";

import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import { UseTheme } from "./theme-utils";

export default function useTheme(): UseTheme {
    return useContext(ThemeContext);
}
