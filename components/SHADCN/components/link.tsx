import { VariantProps } from "class-variance-authority";
import { Route } from "next";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";

export type LinkProps = NextLinkProps<Route> & VariantProps<typeof buttonVariants>;

export default function Link(props: LinkProps) {
    const { className, variant, size, ...others } = props;

    return <NextLink className={cn(buttonVariants({ variant, size, className }))} {...others} />;
}
