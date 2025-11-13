import { useQueryState } from "nuqs";
import { takeQueryParser } from "./queryParamsServerParsers";

export const useTakeQueryParams = () => {
    const [take, setTake] = useQueryState("take", takeQueryParser);
    return { take, setTake };
};
