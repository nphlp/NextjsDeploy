import { Link } from "@atoms/button";
import Card from "@atoms/card";
import Main from "@core/Main";
import { Code, Code2, Combine, Copy, FormInput, Layers, LayoutDashboard, Palette, Puzzle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Route } from "next";

type DevLink = {
    label: string;
    description: string;
    href: Route | string;
    icon: LucideIcon;
};

const devLinks: DevLink[] = [
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

export default function DevPage() {
    return (
        <Main vertical="start" horizontal="stretch">
            <h1 className="text-3xl font-bold">Developer Hub</h1>
            <p className="text-gray-500">Showcase pages and development tools.</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {devLinks.map(({ label, description, href, icon: Icon }) => (
                    <Link key={label} href={href} label={label} className="group w-full rounded-lg" noStyle>
                        <Card className="h-full transition-colors group-hover:border-gray-400">
                            <div className="flex items-center gap-3">
                                <Icon className="size-4 text-gray-500" />
                                <h2 className="text-lg font-semibold">{label}</h2>
                            </div>
                            <p className="text-sm text-gray-500">{description}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </Main>
    );
}
