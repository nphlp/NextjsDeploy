"use client";

import { cn } from "@comps/SHADCN/lib/utils";
import { stringToSlug } from "@utils/string-format";

type AnchorButtonProps = {
    name: string;
};

export default function AnchorButton(props: AnchorButtonProps) {
    const { name } = props;

    const handleClick = () => {
        const slug = stringToSlug(name);

        const element = document.getElementById(slug);

        if (element) {
            const headerOffset = 72; // px
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            // Update URL first without triggering navigation
            history.pushState(null, "", `/examples#${slug}`);

            // Then scroll smoothly
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <button className="group flex w-fit cursor-pointer items-center gap-3" onClick={handleClick}>
            <h3 id={stringToSlug(name)} className="text-lg font-semibold">
                {name}
            </h3>
            <div
                className={cn(
                    "group-hover:bg-accent group-hover:text-accent-foreground dark:group-hover:bg-accent/50",
                    "invisible group-hover:visible",
                    "flex size-8 items-center justify-center rounded-full text-lg font-semibold",
                )}
            >
                #
            </div>
        </button>
    );
}
