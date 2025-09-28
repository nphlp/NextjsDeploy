import { searchQueryParser, updatedAtQueryParser } from "@comps/SHARED/filters/queryParamsServerParsers";
import { useQueryState } from "nuqs";

export const useUpdatedAtQueryParams = () => {
    const [updatedAt, setUpdatedAt] = useQueryState("updatedAt", updatedAtQueryParser);
    return { updatedAt, setUpdatedAt };
};

export const useSearchQueryParams = () => {
    const [search, setSearch] = useQueryState("search", searchQueryParser);
    return { search, setSearch };
};
