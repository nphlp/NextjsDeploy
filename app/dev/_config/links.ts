import {
    Code,
    Code2,
    Combine,
    Copy,
    FormInput,
    Layers,
    LayoutDashboard,
    LucideIcon,
    Palette,
    Puzzle,
} from "lucide-react";
import { Route } from "next";

export type DevLink = {
    label: string;
    description: string;
    href: Route | string;
    icon: LucideIcon;
};

export type DevLinkGroup = {
    label: string;
    links: DevLink[];
};

export const devLinkGroups: DevLinkGroup[] = [
    {
        label: "Guides",
        links: [
            {
                label: "Components",
                description: "Base-UI component showcase",
                href: "/dev/components",
                icon: Puzzle,
            },
            {
                label: "Layout",
                description: "Main layout centering and scroll behavior",
                href: "/dev/layout",
                icon: LayoutDashboard,
            },
            {
                label: "Form",
                description: "Form components and validation examples",
                href: "/dev/form",
                icon: FormInput,
            },
            {
                label: "State",
                description: "State management patterns comparison",
                href: "/dev/state",
                icon: Layers,
            },
        ],
    },
    {
        label: "Design",
        links: [
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
        ],
    },
    {
        label: "API",
        links: [
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
        ],
    },
];

/** Flat list of all links (for search, etc.) */
export const devLinks: DevLink[] = devLinkGroups.flatMap((group) => group.links);
