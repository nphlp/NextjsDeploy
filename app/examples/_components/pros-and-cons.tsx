import { cn } from "@comps/SHADCN/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ReactNode } from "react";

type ProsAndConsProps = {
    variant: "pros" | "cons";
    children: ReactNode;
};

export default function ProsAndCons(props: ProsAndConsProps) {
    const { variant, children } = props;

    return (
        <div
            className={cn(
                "space-y-1 rounded-xl border px-5 py-2 shadow",
                variant === "pros" &&
                    "border-green-500 bg-green-50 stroke-green-700 text-green-700 dark:bg-green-950 dark:stroke-green-500 dark:text-green-500",
                variant === "cons" &&
                    "border-red-400 bg-red-50 stroke-red-700 text-red-700 dark:bg-red-950 dark:stroke-red-400 dark:text-red-400",
            )}
        >
            <div className="flex items-center gap-3">
                {variant === "pros" && <ThumbsUp className="size-5" />}
                {variant === "cons" && <ThumbsDown className="size-5 translate-y-px" />}
                <span className="text-lg font-semibold">{variant === "pros" ? "Pros" : "Cons"}</span>
            </div>
            <ul
                className={cn(
                    "list-disc pl-5 text-sm",
                    variant === "pros" && "text-green-700 dark:text-green-500",
                    variant === "cons" && "text-red-700 dark:text-red-400",
                )}
            >
                {children}
            </ul>
        </div>
    );
}
