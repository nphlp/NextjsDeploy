import task from "../api/task";
import user from "../api/user";
import { InferInput, InferOutput, SolidBuilder } from "./solid-builder";

export type Structure<T> = {
    [group: string]: {
        [method: string]: T;
    };
};

const Solid = {
    task: {
        list: task.list,
        get: task.get,
        create: task.create,
        update: task.update,
        delete: task.delete,
    },
    user: {
        list: user.list,
        get: user.get,
        create: user.create,
        update: user.update,
        delete: user.delete,
    },
    // eslint-disable-next-line
} satisfies Structure<SolidBuilder<any, any>>;

export type SolidType = typeof Solid;
export type SolidGroup = keyof SolidType;
export type SolidGroupValues = SolidType[SolidGroup];
export type SolidMethod<T extends SolidGroup> = keyof SolidType[T];
export type SolidMethodValues<T extends SolidGroup> = SolidType[T][SolidMethod<T>];

export type SolidRoutes = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: {
            input: InferInput<SolidType[G][M]>;
            output: InferOutput<SolidType[G][M]>;
        };
    };
};

// Server types - executeService signature
export type SolidServerType = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: (props?: InferInput<SolidType[G][M]>) => Promise<InferOutput<SolidType[G][M]>>;
    };
};

// Client types - fetcher signature
export type SolidClientType = {
    [G in SolidGroup]: {
        [M in SolidMethod<G>]: (
            props?: InferInput<SolidType[G][M]>,
            signal?: AbortSignal,
        ) => Promise<InferOutput<SolidType[G][M]>>;
    };
};

export const apiPrefix: string[] = ["api", "solid"];

export default Solid;
