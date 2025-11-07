"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type RefetchType = (offsetTime?: number) => void;

type UseFetchProps<T> = {
    fetcher: (options: { signal: AbortSignal }) => Promise<T>;
    keys: unknown[];
    initialData: T;
    debounce?: number;
    fetchOnFirstRender?: boolean;
};

type UseFetchResponse<T> = {
    data: T;
    isLoading: boolean;
    error: string | undefined;
    refetch: RefetchType;
    setDataBypass: (value: T) => void;
};

export const useFetch = <T>(props: UseFetchProps<T>): UseFetchResponse<T> => {
    const { fetcher, keys, initialData, debounce = 0, fetchOnFirstRender = false } = props;

    // Prevent fetch on first render
    const renderRef = useRef(fetchOnFirstRender);

    // States
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    // Re-fetch counter state for refetch function
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // Trigger re-fetch when keys change
    const stringifiedParams = JSON.stringify(keys);
    const memoizedProps = useMemo(() => JSON.parse(stringifiedParams), [stringifiedParams]);

    useEffect(() => {
        // Abort previous fetches, trust only the latest
        const controller = new AbortController();
        const { signal } = controller;

        if (process.env.NODE_ENV === "development") {
            console.log("Fetching with keys:", memoizedProps);
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetcher({ signal });

                if (!signal.aborted) setData(response);
            } catch (error) {
                if (!signal.aborted) setError((error as Error).message);
            } finally {
                if (!signal.aborted) setIsLoading(false);
            }
        };

        const debounceTimeout = setTimeout(() => {
            // Skip fetch on first render
            if (renderRef.current) fetchData();

            // Enable fetches on next renders
            renderRef.current = true;
        }, debounce);

        // Cleanup debounce and abort controller
        return () => {
            clearTimeout(debounceTimeout);
            controller.abort();
        };
    }, [fetcher, memoizedProps, refetchTrigger, debounce]);

    // Manual refetch
    const refetch: RefetchType = (offsetTime: number = 100) => {
        setTimeout(() => {
            setRefetchTrigger((prev) => prev + 1);
        }, offsetTime);
    };

    // Manual set data (bypass fetch)
    const setDataBypass = (value: T) => {
        return setData(value);
    };

    return { data, isLoading, error, refetch, setDataBypass };
};
