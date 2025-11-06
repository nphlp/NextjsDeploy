import { SolidClientType, SolidServerType, SolidType } from "./solid";

const solidServerReMapper = (solidBuilder: SolidType): SolidServerType => {
    const groupKeyValueArray = Object.entries(solidBuilder);

    const groupKeyValueArrayUpdated = groupKeyValueArray.map((groupKeyValue) => {
        const [groupKey, groupValue] = groupKeyValue;

        const methodKeyValueArray = Object.entries(groupValue);

        const methodKeyValueArrayUpdated = methodKeyValueArray.map((methodKeyValue) => {
            const [methodKey, solidBuilderInstance] = methodKeyValue;

            const executeService = solidBuilderInstance.executeService;

            return [methodKey, executeService];
        });

        const methodObjectUpdated = Object.fromEntries(methodKeyValueArrayUpdated);

        return [groupKey, methodObjectUpdated];
    });

    const groupObjectUpdated = Object.fromEntries(groupKeyValueArrayUpdated);

    return groupObjectUpdated;
};

const solidClientReMapper = async (solidBuilder: SolidType): Promise<SolidClientType> => {
    const groupKeyValueArray = Object.entries(solidBuilder);

    const groupKeyValueArrayUpdatedPromises = groupKeyValueArray.map(async (groupKeyValue) => {
        const [groupKey, groupValue] = groupKeyValue;

        const methodKeyValueArray = Object.entries(groupValue);

        const methodKeyValueArrayUpdatedPromises = methodKeyValueArray.map(async (methodKeyValue) => {
            const [methodKey, solidBuilderInstance] = methodKeyValue;

            const fetcher = await solidBuilderInstance.generateFetcher();

            return [methodKey, fetcher];
        });

        const methodKeyValueArrayUpdated = await Promise.all(methodKeyValueArrayUpdatedPromises);

        const methodObjectUpdated = Object.fromEntries(methodKeyValueArrayUpdated);

        return [groupKey, methodObjectUpdated];
    });

    const groupKeyValueArrayUpdated = await Promise.all(groupKeyValueArrayUpdatedPromises);

    const groupObjectUpdated = Object.fromEntries(groupKeyValueArrayUpdated);

    return groupObjectUpdated;
};

export { solidServerReMapper, solidClientReMapper };
