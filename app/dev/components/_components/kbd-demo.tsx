"use client";

import Kbd from "@atoms/kbd";
import { Command } from "lucide-react";
import { useEffect, useState } from "react";

const TRACKED_CODES = ["KeyK", "MetaLeft", "MetaRight"];
const META_CODES = new Set(["MetaLeft", "MetaRight"]);

/**
 * Live-tracked `keydown`/`keyup` for the given codes — no modifier filter
 * (see chrono's `useKeyboardShortcuts` for the filtered prod equivalent
 * that ignores Cmd/Ctrl combos to preserve native browser shortcuts).
 *
 * macOS quirk: while Cmd is held, the OS swallows `keyup` events for
 * non-modifier keys — so a `Cmd+K` press where K is released before Cmd
 * leaves K visually stuck. Workaround: when Cmd itself is released, flush
 * every tracked key so nothing stays "down" past its physical lifetime.
 */
function useTrackedKeys(codes: string[]) {
    const [pressed, setPressed] = useState<Record<string, boolean>>({});
    const codesKey = codes.join(",");

    useEffect(() => {
        const set = new Set(codes);
        const onDown = (e: KeyboardEvent) => {
            if (!set.has(e.code)) return;
            setPressed((p) => (p[e.code] ? p : { ...p, [e.code]: true }));
        };
        const onUp = (e: KeyboardEvent) => {
            if (!set.has(e.code)) return;
            if (META_CODES.has(e.code)) {
                setPressed({});
                return;
            }
            setPressed((p) => {
                if (!p[e.code]) return p;
                const next = { ...p };
                delete next[e.code];
                return next;
            });
        };
        const onBlur = () => setPressed({});

        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        window.addEventListener("blur", onBlur);
        return () => {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
            window.removeEventListener("blur", onBlur);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codesKey]);

    return pressed;
}

/**
 * Kbd demo — single key (K) + combo (⌘ K) packed in a single keycap. The
 * combo lights up when both modifiers are physically held; the single one
 * lights up on its own keypress regardless of modifiers.
 */
export default function KbdDemo() {
    const pressed = useTrackedKeys(TRACKED_CODES);
    const cmdHeld = pressed.MetaLeft || pressed.MetaRight;
    const kHeld = pressed.KeyK ?? false;

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Press the keys to see them light up.</p>
            <div className="flex flex-wrap items-center gap-3">
                <Kbd pressed={kHeld}>K</Kbd>
                <Kbd pressed={cmdHeld && kHeld} className="gap-1">
                    <Command className="size-3" /> K
                </Kbd>
            </div>
        </div>
    );
}
