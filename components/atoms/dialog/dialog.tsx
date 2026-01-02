"use client";

import { Dialog as DialogBaseUI } from "@base-ui/react/dialog";
import cn from "@lib/cn";
import { ReactNode } from "react";
import Button from "../button/button";

type DialogProps = {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function Dialog(props: DialogProps) {
    const { children, open, onOpenChange } = props;

    return (
        <DialogBaseUI.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogBaseUI.Root>
    );
}

type DialogContentProps = {
    children: ReactNode;
    className?: string;
};

export function DialogContent(props: DialogContentProps) {
    const { children, className } = props;

    return (
        <DialogBaseUI.Portal>
            <DialogBaseUI.Backdrop className="fixed inset-0 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
            <DialogBaseUI.Popup
                className={cn(
                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                    "w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
                    "transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                    className,
                )}
            >
                {children}
            </DialogBaseUI.Popup>
        </DialogBaseUI.Portal>
    );
}

type DialogTitleProps = {
    children: ReactNode;
    className?: string;
};

export function DialogTitle(props: DialogTitleProps) {
    const { children, className } = props;

    return <DialogBaseUI.Title className={cn("text-lg font-semibold", className)}>{children}</DialogBaseUI.Title>;
}

type DialogDescriptionProps = {
    children: ReactNode;
    className?: string;
};

export function DialogDescription(props: DialogDescriptionProps) {
    const { children, className } = props;

    return (
        <DialogBaseUI.Description className={cn("mt-2 text-sm text-gray-500", className)}>
            {children}
        </DialogBaseUI.Description>
    );
}

type DialogCloseProps = {
    children: ReactNode;
    asChild?: boolean;
    className?: string;
};

export function DialogClose(props: DialogCloseProps) {
    const { children, asChild, className } = props;

    if (asChild) {
        return <DialogBaseUI.Close render={children as React.ReactElement} className={className} />;
    }

    return (
        <DialogBaseUI.Close
            render={
                <Button
                    label={typeof children === "string" ? children : "Fermer"}
                    colors="outline"
                    className={className}
                />
            }
        >
            {children}
        </DialogBaseUI.Close>
    );
}
