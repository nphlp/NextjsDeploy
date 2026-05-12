import { DEBUG_LAYOUT, HEADER_HEIGHT } from "@core/config";
import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { ReactNode } from "react";

type MainProps = {
    vertical?: "center" | "start" | "end" | "stretch";
    horizontal?: "center" | "start" | "end" | "stretch";
    /**
     * When true, Main takes exactly (100dvh - HEADER_HEIGHT rem) in height
     * and cannot grow beyond. Children can then use flex-1 + overflow-y-auto
     * to implement an internal scroll area with sticky footers.
     * When false (default), Main uses minHeight so the page grows with content.
     */
    fill?: boolean;
    className?: {
        main?: string;
        div?: string;
    };
    children?: ReactNode;
};

export default function Main(props: MainProps) {
    const { vertical = "center", horizontal = "center", fill = false, className, children } = props;
    const sizeStyle = fill
        ? { height: `calc(100dvh - ${HEADER_HEIGHT}rem)` }
        : { minHeight: `calc(100dvh - ${HEADER_HEIGHT}rem)` };

    return (
        <main style={sizeStyle} className={cn(fill && "overflow-hidden", DEBUG_LAYOUT && "bg-teal-100")}>
            <div
                style={sizeStyle}
                className={cn(
                    "flex flex-col items-center justify-start",
                    "mx-auto w-full max-w-225",
                    fill && "overflow-hidden",
                    DEBUG_LAYOUT && "bg-green-100",
                    className?.main,
                )}
            >
                <div
                    style={{
                        justifyContent: vertical, // center (default), start, end or stretch
                        alignItems: horizontal, // center (default), start, end or stretch
                    }}
                    className={cn(
                        "flex flex-col gap-4",
                        "p-4 md:p-7",
                        "w-full flex-1",
                        fill && "min-h-0",
                        DEBUG_LAYOUT && "bg-blue-100",
                        className?.div,
                    )}
                >
                    {children}
                </div>
            </div>
        </main>
    );
}

export const MainSuspense = (props: MainProps) => {
    const { className } = props;

    return (
        <main style={{ minHeight: `calc(100dvh - ${HEADER_HEIGHT}rem)` }} className={cn(DEBUG_LAYOUT && "bg-teal-100")}>
            <div
                style={{ minHeight: `calc(100dvh - ${HEADER_HEIGHT}rem)` }}
                className={cn(
                    "flex flex-col items-center justify-start",
                    "mx-auto w-full max-w-225",
                    DEBUG_LAYOUT && "bg-green-100",
                    className?.main,
                )}
            >
                <div
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    className={cn(
                        "flex flex-col gap-4",
                        "p-4 md:p-7",
                        "w-full flex-1",
                        DEBUG_LAYOUT && "bg-blue-100",
                        className?.div,
                    )}
                >
                    <Loader className="size-6 animate-spin text-gray-600" />
                </div>
            </div>
        </main>
    );
};
