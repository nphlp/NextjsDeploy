"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Body, Fetch, FetchProps, FetchResponse, Method, Params, Route } from "./Fetch";

export type FetchHookProps<
    Input,
    R extends Route<Input>,
    P extends Params<Input, R>,
    M extends Method<Input, R>,
    B extends Body<Input, R>,
> = Omit<FetchProps<Input, R, P, M, B>, "client" | "signal"> & {
    fetchOnFirstRender?: boolean;
    initialData?: FetchResponse<Input, R, P>;
};

export type FetchHookResponse<Input, R extends Route<Input>, P extends Params<Input, R>> = {
    data: FetchResponse<Input, R, P> | undefined;
    isLoading: boolean;
    error: string | undefined;
    refetch: (offsetTime?: number) => void;
};

export const useFetch = <
    Input,
    R extends Route<Input>,
    P extends Params<Input, R>,
    M extends Method<Input, R>,
    B extends Body<Input, R>,
>(
    props: FetchHookProps<Input, R, P, M, B>,
): FetchHookResponse<Input, R, P> => {
    const { route, params, fetchOnFirstRender = false, initialData } = props;

    const stringifiedParams = JSON.stringify(params);
    const memoizedProps = useMemo(
        () => ({
            route,

            // FetchV2
            params: JSON.parse(stringifiedParams),
            // FetchV1
            // params: stringifiedParams ? JSON.parse(stringifiedParams) : undefined,
        }),
        [route, stringifiedParams],
    );

    const fetchOnFirstRenderRef = useRef(fetchOnFirstRender);

    const [data, setData] = useState<FetchResponse<Input, R, P> | undefined>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [renderTime, setRenderTime] = useState(new Date().getTime());

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            setIsLoading(true);

            if (process.env.NODE_ENV === "development") {
                console.log("useFetch: ", memoizedProps);
            }

            try {
                const { route, params } = memoizedProps;

                const response = await Fetch<Input, R, P, M, B>({
                    route,
                    params,
                    client: true,
                    signal,
                });

                if (!signal.aborted) setData(response);
            } catch (error) {
                if (!signal.aborted) setError((error as Error).message);
            } finally {
                if (!signal.aborted) setIsLoading(false);
            }
        };

        if (fetchOnFirstRenderRef.current) {
            fetchData();
        }
        fetchOnFirstRenderRef.current = true;

        return () => controller.abort();
    }, [memoizedProps, renderTime]);

    const refetch = (offsetTime: number = 100) => {
        setTimeout(() => {
            setRenderTime(new Date().getTime());
        }, offsetTime);
    };

    return { data, isLoading, error, refetch };
};
