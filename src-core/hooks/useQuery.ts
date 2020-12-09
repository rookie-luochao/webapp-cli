import { parseSearchString, toSearchString, useRouter } from "@reactorx/router";
import { useRef } from "react";

export interface ParsedUrlQuery {
  [key: string]: string | string[];
}

export function useQuery<T extends ParsedUrlQuery>() {
  const {
    location: { search },
    history,
  } = useRouter();
  const queryState = useRef<T>(parseSearchString(search));

  const setQuery = (handler: (prevQuery: T) => T) => {
    const nextQuery = handler(queryState.current);
    queryState.current = nextQuery;

    history.replace({
      search: toSearchString(nextQuery),
    });
  };

  return [queryState.current, setQuery] as [T, typeof setQuery];
}