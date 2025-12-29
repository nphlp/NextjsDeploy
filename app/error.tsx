"use client";

import Button from "@comps/atoms/button/button";
import { useEffect } from "react";

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error(props: ErrorProps) {
    const { error, reset } = props;

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="max-w-3/4 space-y-4 p-7">
                <h2 className="text-2xl font-bold">Oups!</h2>
                <div>{error.message}</div>
                <Button label="Try Again" onClick={reset} />
            </div>
        </div>
    );
}
