import useBreakpoint from "./use-breakpoint";

/**
 * Collision padding for Base UI Positioners — mirrors the Main div padding
 * (`p-4 md:p-7` in `core/main.tsx`) so popups never cross the page gutter.
 */
export default function useCollisionPadding(): number {
    const bp = useBreakpoint();
    const isDesktop = bp === "md" || bp === "lg" || bp === "xl" || bp === "2xl" || bp === "3xl";
    return isDesktop ? 28 : 16;
}
