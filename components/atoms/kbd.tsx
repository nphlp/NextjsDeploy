import cn from "@lib/cn";
import type { ComponentProps } from "react";

type KbdProps = {
    /** Renders the keycap in a "held down" state — used to mirror keyboard shortcut presses in the UI. */
    pressed?: boolean;
} & ComponentProps<"kbd">;

export default function Kbd(props: KbdProps) {
    const { className, children, pressed = false, ...rest } = props;

    return (
        <kbd
            className={cn(
                "inline-flex items-center justify-center rounded border border-gray-300 bg-gray-50 px-1.5 font-mono text-xs leading-5",
                "transition-[background-color,border-color,transform,box-shadow] duration-75",
                pressed && "translate-y-px border-gray-500 bg-gray-200 shadow-inner",
                className,
            )}
            {...rest}
        >
            {children}
        </kbd>
    );
}
