"use client";

import { AlertDialog as AlertDialogBaseUI } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ReactNode } from "react";
import Button from "../button/button";

type AlertDialogProps = {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function AlertDialog(props: AlertDialogProps) {
    const { children, open, onOpenChange } = props;

    return (
        <AlertDialogBaseUI.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </AlertDialogBaseUI.Root>
    );
}

type AlertDialogContentProps = {
    children: ReactNode;
    className?: string;
};

export function AlertDialogContent(props: AlertDialogContentProps) {
    const { children, className } = props;

    return (
        <AlertDialogBaseUI.Portal>
            <AlertDialogBaseUI.Backdrop className="fixed inset-0 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
            <AlertDialogBaseUI.Popup
                className={cn(
                    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                    "w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
                    "transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                    className,
                )}
            >
                {children}
            </AlertDialogBaseUI.Popup>
        </AlertDialogBaseUI.Portal>
    );
}

type AlertDialogHeaderProps = {
    children: ReactNode;
    className?: string;
};

export function AlertDialogHeader(props: AlertDialogHeaderProps) {
    const { children, className } = props;

    return <div className={cn("space-y-2", className)}>{children}</div>;
}

type AlertDialogTitleProps = {
    children: ReactNode;
    className?: string;
};

export function AlertDialogTitle(props: AlertDialogTitleProps) {
    const { children, className } = props;

    return (
        <AlertDialogBaseUI.Title className={cn("text-lg font-semibold", className)}>{children}</AlertDialogBaseUI.Title>
    );
}

type AlertDialogDescriptionProps = {
    children: ReactNode;
    className?: string;
};

export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
    const { children, className } = props;

    return (
        <AlertDialogBaseUI.Description className={cn("text-sm text-gray-500", className)}>
            {children}
        </AlertDialogBaseUI.Description>
    );
}

type AlertDialogFooterProps = {
    children: ReactNode;
    className?: string;
};

export function AlertDialogFooter(props: AlertDialogFooterProps) {
    const { children, className } = props;

    return <div className={cn("mt-4 flex justify-end gap-2", className)}>{children}</div>;
}

type AlertDialogActionProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
};

export function AlertDialogAction(props: AlertDialogActionProps) {
    const { children, onClick, className } = props;

    return (
        <AlertDialogBaseUI.Close
            render={
                <Button
                    label={typeof children === "string" ? children : "Confirmer"}
                    colors="primary"
                    className={className}
                />
            }
            onClick={onClick}
        >
            {children}
        </AlertDialogBaseUI.Close>
    );
}

type AlertDialogCancelProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
};

export function AlertDialogCancel(props: AlertDialogCancelProps) {
    const { children, onClick, className } = props;

    return (
        <AlertDialogBaseUI.Close
            render={
                <Button
                    label={typeof children === "string" ? children : "Annuler"}
                    colors="outline"
                    className={className}
                />
            }
            onClick={onClick}
        >
            {children}
        </AlertDialogBaseUI.Close>
    );
}
