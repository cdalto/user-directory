export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  sortValue?: (value: T[keyof T]) => string | number;
  render?: (value: T[keyof T]) => React.ReactNode;
}

export interface TableProps<T extends object> {
  data: T[],
  columns: Column<T>[],
  rowKey: keyof T
}
