"use client";

import Button from "@atoms/button";
import Skeleton from "@atoms/skeleton";
import cn from "@lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

/**
 * Compute which page numbers to display
 * Always shows: 1, last, page-1, page, page+1
 * Adds "ellipsis" markers between gaps
 */
function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);
    if (page > 1) pages.add(page - 1);
    pages.add(page);
    if (page < totalPages) pages.add(page + 1);

    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

    const result: (number | "ellipsis")[] = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
            result.push("ellipsis");
        }
        result.push(sorted[i]);
    }

    return result;
}

export default function Pagination(props: PaginationProps) {
    const { page, totalPages, onPageChange } = props;

    if (totalPages <= 1) return null;

    const items = getPageItems(page, totalPages);
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    return (
        <nav className="flex items-center justify-center gap-1">
            <Button
                label="Previous page"
                onClick={() => onPageChange(page - 1)}
                disabled={isFirstPage}
                colors="ghost"
                className="size-9 min-h-9 p-0"
            >
                <ChevronLeft className="size-5" />
            </Button>

            {items.map((item, index) => {
                if (item === "ellipsis") {
                    return (
                        <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400">
                            ...
                        </span>
                    );
                }

                const isCurrent = item === page;

                return (
                    <Button
                        key={item}
                        label={`Page ${item}`}
                        onClick={() => onPageChange(item)}
                        colors={isCurrent ? "default" : "ghost"}
                        padding="sm"
                        noFlex
                        className={cn("min-h-9 min-w-9", !isCurrent && "text-gray-600")}
                    >
                        {item}
                    </Button>
                );
            })}

            <Button
                label="Next page"
                onClick={() => onPageChange(page + 1)}
                disabled={isLastPage}
                colors="ghost"
                className="size-9 min-h-9 p-0"
            >
                <ChevronRight className="size-5" />
            </Button>
        </nav>
    );
}

export const PaginationSkeleton = () => {
    return (
        <nav className="flex items-center justify-center gap-1">
            <Button label="Previous page" colors="ghost" className="size-9 min-h-9 p-0">
                <ChevronLeft className="size-5" />
            </Button>
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <span className="px-1 text-sm text-gray-300">...</span>
            <Skeleton className="size-9 rounded-md" />
            <Button label="Next page" colors="ghost" className="size-9 min-h-9 p-0">
                <ChevronRight className="size-5" />
            </Button>
        </nav>
    );
};
