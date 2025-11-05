type SolidContractStructure = {
    [key: string]: {
        [key: string]: {
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
            route: string;
        };
    };
};

const SolidContract: SolidContractStructure = {
    user: {
        list: {
            method: "GET",
            route: "/user/list",
        },
        get: {
            method: "GET",
            route: "/user/get",
        },
    },
    task: {
        list: {
            method: "GET",
            route: "/task/list",
        },
        get: {
            method: "GET",
            route: "/task/get",
        },
    },
};

type SolidContractType = typeof SolidContract;
type SolidRoutes = keyof SolidContractType;

export default SolidContract;
export type { SolidContractType, SolidRoutes };
