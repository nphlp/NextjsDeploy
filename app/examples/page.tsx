import Link from "@comps/UI/button/link";
import Card from "@comps/UI/card";
import { Route } from "next";

type LinkProps = {
    label: string;
    href: Route;
    text: string;
};

export default function Page() {
    const links: LinkProps[] = [
        {
            label: "Work Schedule",
            href: "/examples/schedules-input",
            text: "Add a work schedule with work days to a user",
        },
        {
            label: "Shadcn Accordion",
            href: "/examples/accordion",
            text: "An accordion from origin/shadcn ui",
        },
        {
            label: "Shadcn Chart",
            href: "/examples/chart",
            text: "A chart from origin/shadcn ui",
        },
        {
            label: "Tanstack Table",
            href: "/examples/tanstack-table",
            text: "A table from tanstack with shadcn ui",
        },
        {
            label: "Send Email",
            href: "/examples/email",
            text: "How to send an email with nodemailer",
        },
        {
            label: "Patate",
            href: "/examples/patate",
            text: "A patate",
        },
        {
            label: "Auto-Layout",
            href: "/examples/auto-layout",
            text: "How to create a auto-layout",
        },
        {
            label: "Bouncy Height Resizer",
            href: "/examples/bouncy-height-resizer",
            text: "How to create a bouncy height resize",
        },
        {
            label: "Formulaire",
            href: "/examples/formulaire",
            text: "How to create a form with input, select...",
        },
        {
            label: "Perspective card",
            href: "/examples/perspective-card",
            text: "How to create a perspective card",
        },
        {
            label: "SSR fetching",
            href: "/examples/ssr",
            text: "How to create a user permissions",
        },
    ];

    return (
        <div className="p-7">
            <Card className="flex flex-col items-center gap-4 pl-10">
                <h1 className="text-2xl font-bold">Examples</h1>
                <ul className="space-y-2">
                    {links.map((link, index) => (
                        <UnderlinedLink key={index} {...link} />
                    ))}
                </ul>
            </Card>
        </div>
    );
}

type UnderlinedLinkProps = LinkProps;

const UnderlinedLink = (props: UnderlinedLinkProps) => {
    const { href, label, text } = props;
    return (
        <li className="list-disc">
            <Link href={href} variant="underline" label={label} className="px-1 decoration-gray-600" />
            <p className="text-xs text-gray-500">{text}</p>
        </li>
    );
};
