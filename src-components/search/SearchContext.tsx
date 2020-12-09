import { IFieldState, IFormState } from "@reactorx/form";
import { createContext, useContext } from "react";
import { Observable } from "rxjs";

export interface IPager {
  offset: number;
  size: number;
}

export interface ISearchState<TFilters = any, T = any> {
  data: T[];
  total: number;
  initialFilters: TFilters;
  initialPager: IPager;
  filters: TFilters;
  pager: IPager;
  fieldState: IFormState;
}

export interface ISearchContext<TFilters, T> {
  search: string;
  searchState$: Observable<ISearchState<TFilters, T>>;
  arg: any;
  fetch: () => void;
  getFieldState: (name: string) => { fieldState: IFieldState & { name: string; value: any } };
  updatePager: (pager: IPager) => void;
  updateFilters: (filters: TFilters, opts: { field: string }) => void;
}

const SearchContext = createContext({} as ISearchContext<any, any>);

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = SearchContext.Provider;
export const WithSearch = SearchContext.Consumer;
