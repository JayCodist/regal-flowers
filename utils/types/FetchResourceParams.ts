export interface FilterLogic {
  category?: string[];
  tags?: string[];
  productClass?: string;
}

export interface SortLogic {
  sortField: string;
  sortType: "asc" | "desc";
}

export interface FetchResourceParams<F = FilterLogic> {
  pageSize?: number;
  pageNumber?: number;
  searchField?: string;
  searchValue?: string;
  filter?: F;
  sortLogic?: SortLogic;
  mergeRecords?: boolean;
}
