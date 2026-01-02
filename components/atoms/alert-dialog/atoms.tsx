import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, ReactNode } from "react";

export type AlertDialogProps = { children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Root>;

export const Root = (props: AlertDialogProps) => {
    const { children, ...otherProps } = props;

    return <AlertDialogBaseUi.Root {...otherProps}>{children}</AlertDialogBaseUi.Root>;
};

export const Trigger = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Trigger>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Trigger
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-destructive text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Trigger>
    );
};

export const Backdrop = (props: { className?: string } & ComponentProps<typeof AlertDialogBaseUi.Backdrop>) => {
    const { className, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Backdrop
            className={cn(
                // Layout
                "fixed inset-0 z-10 min-h-dvh supports-[-webkit-touch-callout:none]:absolute",
                // Background
                "bg-black opacity-20 dark:opacity-70",
                // Animation
                "transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...otherProps}
        />
    );
};

export const Portal = (props: { children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Portal>) => {
    const { children, ...otherProps } = props;

    return <AlertDialogBaseUi.Portal {...otherProps}>{children}</AlertDialogBaseUi.Portal>;
};

export const Popup = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Popup>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Popup
            className={cn(
                // Layout
                "fixed top-1/2 left-1/2 z-10 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 p-6",
                // Border
                "rounded-lg outline-1 outline-gray-200 dark:outline-gray-300",
                // Background
                "bg-background",
                // Text
                "text-foreground",
                // Animation
                "transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Popup>
    );
};

export const Title = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Title>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Title
            className={cn(
                // Layout
                "-mt-1.5 mb-1",
                // Text
                "text-lg font-medium",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Title>
    );
};

export const Description = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Description>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Description
            className={cn(
                // Layout
                "mb-6",
                // Text
                "text-base text-gray-600",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Description>
    );
};

export const Close = (
    props: { className?: string; children?: ReactNode } & ComponentProps<typeof AlertDialogBaseUi.Close>,
) => {
    const { className, children, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Close
            className={cn(
                // Layout
                "flex h-10 items-center justify-center px-3.5",
                // Border
                "rounded-md border border-gray-200",
                // Background
                "bg-background",
                // Text
                "text-foreground text-base font-medium select-none",
                // State
                "focus-visible:outline-outline hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 active:bg-gray-100",
                // Overrides
                className,
            )}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Close>
    );
};
