"use client";

import Link from "@comps/UI/button/link";
import { combo } from "@lib/combo";
import { Route } from "next";
import { usePathname } from "next/navigation";

type LinkType = {
    label: string;
    href: Route;
};

const links: LinkType[] = [
    { label: "Home", href: "/" },
    { label: "Comps", href: "/comps" },
    { label: "Examples", href: "/examples" },
];

type LinksProps = {
    scrollToTop?: boolean;
};

export default function Links(props: LinksProps) {
    const { scrollToTop = false } = props;

    const path = usePathname();

    const handleNativation = () => {
        const mainId = document.getElementById("main");
        if (scrollToTop && mainId) mainId.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex gap-2">
            {links.map(({ href, label }) => (
                <Link
                    key={label}
                    label={label}
                    href={href}
                    variant="ghost"
                    onNavigate={handleNativation}
                    className={combo("text-lg", path === href && "font-bold")}
                />
            ))}
        </div>
    );
}
