"use client";

import { CSSProperties } from "react";
import {
    Backdrop,
    Close,
    Description,
    DragHandle,
    DrawerProps,
    Portal,
    Root,
    SnapContent,
    SnapPopup,
    SnapViewport,
    Title,
    Trigger,
} from "./atoms";

const TOP_MARGIN_REM = 1;
const VISIBLE_SNAP_POINTS_REM = [30];

function toViewportSnapPoint(heightRem: number) {
    return `${heightRem + TOP_MARGIN_REM}rem`;
}

const snapPoints = [...VISIBLE_SNAP_POINTS_REM.map(toViewportSnapPoint), 1];

export default function DrawerSnapPoints(props: DrawerProps) {
    const { children, ...otherProps } = props;

    // Composable usage
    if (children) {
        return (
            <Root snapPoints={snapPoints} {...otherProps}>
                {children}
            </Root>
        );
    }

    // Composable demo
    return (
        <Root snapPoints={snapPoints} {...otherProps}>
            <Trigger>Open snap drawer</Trigger>
            <Portal>
                <Backdrop />
                <SnapViewport>
                    <SnapPopup legacyProps={{ style: { "--top-margin": `${TOP_MARGIN_REM}rem` } as CSSProperties }}>
                        <DragHandle>
                            <Title className="mt-2.5 mb-0 cursor-default text-center">Snap points</Title>
                        </DragHandle>
                        <SnapContent>
                            <div className="mx-auto w-full max-w-87.5">
                                <Description className="text-center">
                                    Drag the sheet to snap between a compact peek and a near full-height view.
                                </Description>
                                <div className="mb-6 grid gap-3" aria-hidden>
                                    {Array.from({ length: 20 }, (_, index) => (
                                        <div
                                            key={index}
                                            className="h-12 rounded-xl border border-gray-200 bg-gray-100"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-end gap-4">
                                    <Close>Close</Close>
                                </div>
                            </div>
                        </SnapContent>
                    </SnapPopup>
                </SnapViewport>
            </Portal>
        </Root>
    );
}
