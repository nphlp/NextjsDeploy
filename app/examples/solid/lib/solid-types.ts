import { SolidRouterType } from "./solid";
import { InferInput, InferOutput, SolidBuilder } from "./solid-builder";

export type { SolidRouterType };
export type SolidGroup = keyof SolidRouterType;
export type SolidMethod<T extends SolidGroup> = keyof SolidRouterType[T];

export type Structure<T> = {
    [group: string]: {
        [method: string]: T;
    };
};

// eslint-disable-next-line
export type SolidRouterStructure = Structure<SolidBuilder<any, any>>;

export type SolidRoutes = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: {
            input: InferInput<SolidRouterType[G][M]>;
            output: InferOutput<SolidRouterType[G][M]>;
        };
    };
};

// Server types - executeService signature
export type SolidServerType = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: (
            props?: InferInput<SolidRouterType[G][M]>,
        ) => Promise<InferOutput<SolidRouterType[G][M]>>;
    };
};

// Client types - fetcher signature
export type SolidClientType = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: (
            props?: InferInput<SolidRouterType[G][M]>,
            signal?: AbortSignal,
        ) => Promise<InferOutput<SolidRouterType[G][M]>>;
    };
};
