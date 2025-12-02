import { VariantProps } from "class-variance-authority";
import { Route } from "next";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";

export type LinkProps = {
    href: Route;
    noStyle?: boolean;
    disabled?: boolean;
} & NextLinkProps<Route> &
    VariantProps<typeof buttonVariants>;

export default function Link(props: LinkProps) {
    const { href, className, variant, size, noStyle = false, children, disabled = false, ...others } = props;

    if (disabled) {
        return (
            <button disabled className={cn(noStyle ? className : buttonVariants({ variant, size, className }))}>
                {children}
            </button>
        );
    }

    return (
        <NextLink
            href={href}
            className={cn(noStyle ? className : buttonVariants({ variant, size, className }))}
            {...others}
        >
            {children}
        </NextLink>
    );
}
