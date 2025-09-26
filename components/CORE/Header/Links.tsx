"use client";

import Link from "@comps/UI/button/link";
import { combo } from "@lib/combo";
import { usePathname } from "next/navigation";
import { LinkType } from "../Header";

type LinksProps = {
    links: LinkType[];
};

export default function Links(props: LinksProps) {
    const { links } = props;

    const path = usePathname();

    return (
        <div className="flex gap-2">
            {links.map(({ href, label }) => (
                <Link
                    key={label}
                    label={label}
                    href={href}
                    variant="ghost"
                    className={combo("text-lg", path === href && "font-bold")}
                />
            ))}
        </div>
    );
}
