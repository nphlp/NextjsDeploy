"use client";

import { combo } from "@lib/combo";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { KeyboardEvent, ReactNode, RefObject, useEffect } from "react";
import { DrawerVariant, theme } from "./theme";

export type DrawerClassName = {
    component?: string;
    drawer?: string;

    backgroundBlur?: string;
    backgroundColor?: string;
    backgroundButton?: string;

    closeButton?: string;
    closeIcon?: string;
};

type DrawerProps = {
    setIsDrawerOpen: (visible: boolean) => void;
    isDrawerOpen: boolean;
    focusToRef?: RefObject<HTMLElement | null>;

    // Config
    noBackgroundBlur?: boolean;
    noBackgroundColor?: boolean;
    noBackgroundButton?: boolean;
    withCloseButton?: boolean;

    // Animation
    noAnimation?: boolean;
    duration?: number;

    // Styles
    variant?: DrawerVariant;
    className?: DrawerClassName;

    children: ReactNode;
};

/**
 * Drawer
 * @example
 * ```tsx
 * // Define the state
 * const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
 * const drawerRef = useRef<HTMLButtonElement>(null);
 *
 * // Use the component
 * <Drawer
 *     className={{
 *         drawer: "space-y-4",
 *     }}
 *     setIsDrawerOpen={setIsDrawerOpen}
 *     isDrawerOpen={isDrawerOpen}
 *     focusToRef={drawerButtonRef}
 *     withCloseButton
 * >
 *     <div className="text-xl font-bold">Title</div>
 *     <div>Description</div>
 *     <Button
 *         label="Close"
 *         ref={drawerButtonRef}
 *         onClick={() => setIsDrawerOpen(false)}
 *     />
 * </Drawer>
 * ```
 */
export default function Drawer(props: DrawerProps) {
    const {
        isDrawerOpen,
        setIsDrawerOpen,
        focusToRef,
        noBackgroundBlur = false,
        noBackgroundButton = false,
        noBackgroundColor = false,
        withCloseButton = false,
        noAnimation = false,
        duration = 0.3,
        variant = "default",
        className,
        children,
    } = props;

    const animationDuration = noAnimation ? 0 : duration;

    const minimalTimoutToFocus = noAnimation ? 30 : animationDuration * 1000;

    // Auto focus to the given ref when modal is opened
    useEffect(() => {
        if (isDrawerOpen && focusToRef?.current) {
            // Can not use requestAnimationFrame with translateX animation
            setTimeout(() => focusToRef.current?.focus(), minimalTimoutToFocus);
        }
    }, [isDrawerOpen, focusToRef, minimalTimoutToFocus]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") setIsDrawerOpen(false);
    };

    return (
        <div
            className={combo(!isDrawerOpen && "pointer-events-none", theme[variant].component, className?.component)}
            onKeyDown={handleKeyDown}
        >
            {/* Background Blur */}
            {!noBackgroundBlur && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isDrawerOpen ? 1 : 0,
                        transition: { duration: animationDuration / 6 },
                    }}
                    className={combo(theme[variant].backgroundBlur, className?.backgroundBlur)}
                />
            )}

            {/* Background Color */}
            {!noBackgroundColor && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isDrawerOpen ? 1 : 0,
                        transition: { duration: animationDuration / 2 },
                    }}
                    className={combo(theme[variant].backgroundColor, className?.backgroundColor)}
                />
            )}

            {/* Background Button */}
            {!noBackgroundButton && (
                <motion.button
                    type="button"
                    aria-label="close-modal"
                    tabIndex={-1} // Make the button not focusable
                    onClick={() => setIsDrawerOpen(false)}
                    className={combo(theme[variant].backgroundButton, className?.backgroundButton)}
                />
            )}

            {/* Drawer */}
            <motion.div
                initial={{
                    display: "none",
                    translateX: "100%",
                }}
                animate={{
                    display: isDrawerOpen ? "" : "none",
                    translateX: isDrawerOpen ? "0px" : "100%",
                }}
                transition={{
                    duration: animationDuration,
                    ease: "easeInOut",
                }}
                className={combo("w-full sm:w-[400px]", theme[variant].drawer, className?.drawer)}
            >
                <CloseButton
                    setIsDrawerOpen={setIsDrawerOpen}
                    withCloseButton={withCloseButton}
                    className={className}
                    variant={variant}
                />
                {children}
            </motion.div>
        </div>
    );
}

type CloseButtonProps = {
    setIsDrawerOpen: (visible: boolean) => void;
    withCloseButton: boolean;
    variant: DrawerVariant;
    className?: {
        closeButton?: string;
        closeIcon?: string;
    };
};

const CloseButton = (props: CloseButtonProps) => {
    const { className, setIsDrawerOpen, withCloseButton, variant } = props;

    if (!withCloseButton) return null;

    return (
        <button
            type="button"
            aria-label="Close modal"
            onClick={() => setIsDrawerOpen(false)}
            className={combo(theme[variant].closeButton, className?.closeButton)}
        >
            <X className={combo(theme[variant].closeIcon, className?.closeIcon)} />
        </button>
    );
};
