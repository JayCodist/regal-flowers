export interface FilterLogic {
  category?: string[];
  tags?: string[];
  productClass?: string;
}

export interface SortLogic {
  field: string;
  sortType: "asc" | "dsc";
}

export interface FetchResourceParams<F = FilterLogic> {
  pageSize?: number;
  pageNumber?: number;
  searchStr?: string;
  filter?: F;
  sortLogic?: SortLogic;
  mergeRecords?: boolean;
}
