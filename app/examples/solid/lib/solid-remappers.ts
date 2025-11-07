import { SolidRouterType, SolidServerType } from "./solid-types";

export const solidServerReMapper = (solidBuilder: SolidRouterType): SolidServerType => {
    const groupKeyValueArray = Object.entries(solidBuilder);

    const groupKeyValueArrayUpdated = groupKeyValueArray.map((groupKeyValue) => {
        const [groupKey, groupValue] = groupKeyValue;

        const methodKeyValueArray = Object.entries(groupValue);

        const methodKeyValueArrayUpdated = methodKeyValueArray.map((methodKeyValue) => {
            const [methodKey, solidBuilderInstance] = methodKeyValue;

            // Bind executeService to preserve 'this' context
            const executeService = solidBuilderInstance.executeService.bind(solidBuilderInstance);

            return [methodKey, executeService];
        });

        const methodObjectUpdated = Object.fromEntries(methodKeyValueArrayUpdated);

        return [groupKey, methodObjectUpdated];
    });

    const groupObjectUpdated = Object.fromEntries(groupKeyValueArrayUpdated);

    return groupObjectUpdated;
};

// const solidClientReMapper = async (solidBuilder: SolidRouterType): Promise<SolidClientType> => {
//     const groupKeyValueArray = Object.entries(solidBuilder);

//     const groupKeyValueArrayUpdatedPromises = groupKeyValueArray.map(async (groupKeyValue) => {
//         const [groupKey, groupValue] = groupKeyValue;

//         const methodKeyValueArray = Object.entries(groupValue);

//         const methodKeyValueArrayUpdatedPromises = methodKeyValueArray.map(async (methodKeyValue) => {
//             const [methodKey, solidBuilderInstance] = methodKeyValue;

//             // Generate fetcher with proper binding
//             const fetcher = await solidBuilderInstance.generateFetcher();

//             return [methodKey, fetcher];
//         });

//         const methodKeyValueArrayUpdated = await Promise.all(methodKeyValueArrayUpdatedPromises);

//         const methodObjectUpdated = Object.fromEntries(methodKeyValueArrayUpdated);

//         return [groupKey, methodObjectUpdated];
//     });

//     const groupKeyValueArrayUpdated = await Promise.all(groupKeyValueArrayUpdatedPromises);

//     const groupObjectUpdated = Object.fromEntries(groupKeyValueArrayUpdated);

//     return groupObjectUpdated;
// };

// export { solidServerReMapper, solidClientReMapper };
