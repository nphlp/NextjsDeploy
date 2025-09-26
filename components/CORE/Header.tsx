import { Route } from "next";
import Links from "./Header/Links";
import ThemeToggle from "./theme/themeToggle";

export type LinkType = {
    label: string;
    href: Route;
};

export default function Header() {
    const links: LinkType[] = [
        { label: "Home", href: "/" },
        { label: "Comps", href: "/comps" },
    ];

    return (
        <header className="flex w-full items-center justify-end gap-4 px-5 py-3">
            <Links links={links} />
            <ThemeToggle />
        </header>
    );
}
