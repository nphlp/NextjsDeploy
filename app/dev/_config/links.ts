import { Code, Code2, Combine, Copy, FormInput, Layers, LayoutDashboard, Palette, Puzzle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Route } from "next";

export type DevLink = {
    label: string;
    description: string;
    href: Route | string;
    icon: LucideIcon;
};

export const devLinks: DevLink[] = [
    {
        label: "Dev Hub",
        description: "Back to the main developer hub",
        href: "/dev",
        icon: Code,
    },
    {
        label: "Form",
        description: "Form components and validation examples",
        href: "/dev/form",
        icon: FormInput,
    },
    {
        label: "Button UI",
        description: "Button variants, sizes, and states",
        href: "/dev/ui",
        icon: Combine,
    },
    {
        label: "Colors",
        description: "Theme color palette reference",
        href: "/dev/colors",
        icon: Palette,
    },
    {
        label: "Skeleton",
        description: "Loading skeleton components",
        href: "/dev/skeleton",
        icon: Copy,
    },
    {
        label: "Layout",
        description: "Layout structure and grid showcase",
        href: "/dev/layout-demo",
        icon: LayoutDashboard,
    },
    {
        label: "Components",
        description: "Base-UI component showcase",
        href: "/dev/components",
        icon: Puzzle,
    },
    {
        label: "Dialogs",
        description: "Dialog, drawer, and overlay variants",
        href: "/dev/dialogs",
        icon: Layers,
    },
    {
        label: "API Docs",
        description: "Scalar OpenAPI documentation",
        href: "/dev/scalar",
        icon: Code,
    },
    {
        label: "Auth API",
        description: "Better Auth API reference",
        href: "/api/auth/reference" as Route,
        icon: Code2,
    },
];
