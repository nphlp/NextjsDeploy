import { CardLink, Link as OverlayLink } from "@atoms/card";
import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import type { ReactNode } from "react";

type AccountLinkCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
    preview: ReactNode;
    href: Route;
};

export default function AccountLinkCard(props: AccountLinkCardProps) {
    const { icon, title, description, preview, href } = props;

    return (
        <CardLink className="flex flex-row items-center gap-4 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-base font-semibold">
                        <OverlayLink href={href} label={`Modifier : ${title}`}>
                            {title}
                        </OverlayLink>
                    </h3>
                </div>
                <p className="text-xs text-gray-500">{description}</p>
                <div className="mt-2 text-sm">{preview}</div>
            </div>
            <ChevronRight className="size-5 flex-none text-gray-400" />
        </CardLink>
    );
}
