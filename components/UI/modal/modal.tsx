"use client";

import { combo } from "@lib/combo";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { KeyboardEvent, ReactNode, RefObject, useEffect } from "react";
import { ModalVariant, theme } from "./theme";

export type ModalClassName = {
    component?: string;
    subComponent?: string;

    cardContainer?: string;
    card?: string;

    backgroundBlur?: string;
    backgroundColor?: string;
    backgroundButton?: string;

    closeButton?: string;
    closeIcon?: string;
};

type ModalProps = {
    setIsModalOpen: (visible: boolean) => void;
    isModalOpen: boolean;
    focusToRef?: RefObject<HTMLElement | null>;

    // Config
    noBackgroundBlur?: boolean;
    noBackgroundColor?: boolean;
    noBackgroundButton?: boolean;
    withCloseButton?: boolean;
    fixedToTop?: boolean;

    // Animation
    noAnimation?: boolean;
    duration?: number;

    // Styles
    variant?: ModalVariant;
    className?: ModalClassName;

    children: ReactNode;
};

/**
 * Modal
 * @example
 * ```tsx
 * // Define the state
 * const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 * const buttonRef = useRef<HTMLButtonElement>(null);
 *
 * // Use the component
 * <Modal
 *     className={{
 *         // Outside the modal
 *         cardContainer: "px-5 py-16",
 *         // Inside the modal
 *         card: "max-w-[500px] w-[400px] space-y-4",
 *     }}
 *     setIsModalOpen={setIsModalOpen}
 *     isModalOpen={isModalOpen}
 *     focusToRef={buttonRef}
 *     withCloseButton
 * >
 *     <div className="text-xl font-bold">Title</div>
 *     <div>Description</div>
 *     <Button
 *         label="Close"
 *         ref={buttonRef}
 *         onClick={() => setIsModalOpen(false)}
 *     />
 * </Modal>
 * ```
 */
export default function Modal(props: ModalProps) {
    const {
        isModalOpen,
        setIsModalOpen,
        focusToRef,
        noBackgroundBlur = false,
        noBackgroundButton = false,
        noBackgroundColor = false,
        withCloseButton = false,
        fixedToTop = false,
        noAnimation = false,
        duration = 0.3,
        className,
        children,
        variant = "default",
    } = props;

    const animationDuration = noAnimation ? 0 : duration;

    // Auto focus to the given ref when modal is opened
    useEffect(() => {
        if (isModalOpen && focusToRef?.current) {
            requestAnimationFrame(() => focusToRef.current?.focus());
        }
    }, [isModalOpen, focusToRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") setIsModalOpen(false);
    };

    return (
        <div
            className={combo(!isModalOpen && "pointer-events-none", theme[variant].component, className?.component)}
            onKeyDown={handleKeyDown}
        >
            {/* Sub Component */}
            <div className={combo(theme[variant].subComponent, className?.subComponent)}>
                {/* Background Blur */}
                {!noBackgroundBlur && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isModalOpen ? 1 : 0,
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
                            opacity: isModalOpen ? 1 : 0,
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
                        onClick={() => setIsModalOpen(false)}
                        tabIndex={-1} // Make the button not focusable
                        className={combo(theme[variant].backgroundButton, className?.backgroundButton)}
                    />
                )}

                {/* Card Container */}
                <div className={combo(fixedToTop && "flex-1", theme[variant].cardContainer, className?.cardContainer)}>
                    {/* Card */}
                    <motion.div
                        initial={{
                            display: "none",
                            scale: 0,
                        }}
                        animate={{
                            display: isModalOpen ? "" : "none",
                            scale: isModalOpen ? 1 : 0,
                        }}
                        transition={{
                            duration: animationDuration,
                            ease: "easeInOut",
                            type: "spring",
                        }}
                        className={combo(theme[variant].card, className?.card)}
                    >
                        <CrossButton
                            setIsModalOpen={setIsModalOpen}
                            withCloseButton={withCloseButton}
                            className={className}
                            variant={variant}
                        />
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

type CrossButtonProps = {
    setIsModalOpen: (visible: boolean) => void;
    withCloseButton: boolean;
    variant: ModalVariant;
    className?: {
        closeButton?: string;
        closeIcon?: string;
    };
};

const CrossButton = (props: CrossButtonProps) => {
    const { className, setIsModalOpen, withCloseButton, variant } = props;

    if (!withCloseButton) return null;

    return (
        <button
            type="button"
            aria-label="Close modal"
            onClick={() => setIsModalOpen(false)}
            className={combo(theme[variant].closeButton, className?.closeButton)}
        >
            <X className={combo(theme[variant].closeIcon, className?.closeIcon)} />
        </button>
    );
};
