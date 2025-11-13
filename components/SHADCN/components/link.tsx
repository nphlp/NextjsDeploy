import { VariantProps } from "class-variance-authority";
import { Route } from "next";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";

export type LinkProps = { disabled?: boolean } & NextLinkProps<Route> & VariantProps<typeof buttonVariants>;

export default function Link(props: LinkProps) {
    const { className, variant, size, children, disabled = false, ...others } = props;

    if (disabled)
        return (
            <button disabled className={cn(buttonVariants({ variant, size, className }))}>
                {children}
            </button>
        );

    return (
        <NextLink className={cn(buttonVariants({ variant, size, className }))} {...others}>
            {children}
        </NextLink>
    );
}
