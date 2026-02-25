import { DEBUG_LAYOUT, HEADER_HEIGHT } from "@core/config";
import cn from "@lib/cn";
import { Loader } from "lucide-react";
import { ReactNode } from "react";

type MainProps = {
    vertical?: "center" | "start" | "end" | "stretch";
    horizontal?: "center" | "start" | "end" | "stretch";
    className?: {
        main?: string;
        div?: string;
    };
    children?: ReactNode;
};

export default function Main(props: MainProps) {
    const { vertical = "center", horizontal = "center", className, children } = props;

    return (
        <main
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
                    justifyContent: vertical, // center (default), start, end or stretch
                    alignItems: horizontal, // center (default), start, end or stretch
                }}
                className={cn(
                    "flex flex-col gap-4",
                    "p-4 md:p-7",
                    "w-full flex-1",
                    DEBUG_LAYOUT && "bg-blue-100",
                    className?.div,
                )}
            >
                {children}
            </div>
        </main>
    );
}

export const MainSuspense = (props: MainProps) => {
    const { className } = props;

    return (
        <main
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
        </main>
    );
};
