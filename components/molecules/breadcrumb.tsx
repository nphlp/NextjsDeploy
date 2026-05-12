import { Link } from "@atoms/button";
import { SkeletonText } from "@atoms/skeleton";
import cn from "@lib/cn";
import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import { Fragment } from "react";

export type BreadcrumbItem = {
    label: string | null;
    href?: Route;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
    title: string;
    className?: string;
};

export default function Breadcrumb(props: BreadcrumbProps) {
    const { items, title, className } = props;

    const visibleItems = items.filter((i): i is BreadcrumbItem & { label: string } => Boolean(i.label));

    return (
        <h1 className={cn("flex flex-wrap items-center gap-x-2 text-lg", className)}>
            {visibleItems.map((item, i) => (
                <Fragment key={i}>
                    {item.href ? (
                        <Link
                            href={item.href}
                            label={item.label}
                            className="rounded text-lg font-normal text-gray-600 hover:text-gray-900"
                            noStyle
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-normal text-gray-600">{item.label}</span>
                    )}
                    <ChevronRight className="size-4 text-gray-400" />
                </Fragment>
            ))}
            <span className="font-bold">{title}</span>
        </h1>
    );
}

type BreadcrumbSkeletonProps = {
    itemCount?: number;
    itemWidths?: string[];
    titleWidth?: string;
    className?: string;
};

export const BreadcrumbSkeleton = (props: BreadcrumbSkeletonProps) => {
    const { itemCount, itemWidths, titleWidth = "128px", className } = props;

    const count = itemWidths?.length ?? itemCount ?? 1;

    return (
        <div aria-hidden className={cn("flex flex-wrap items-center gap-x-2 text-lg", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Fragment key={i}>
                    <SkeletonText fontSize="lg" width={itemWidths?.[i] ?? "72px"} />
                    <ChevronRight className="size-4 text-gray-400" />
                </Fragment>
            ))}
            <SkeletonText fontSize="lg" width={titleWidth} />
        </div>
    );
};
