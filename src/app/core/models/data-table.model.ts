export interface DataTable<M> {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  first: number;
  content: M[];
}
