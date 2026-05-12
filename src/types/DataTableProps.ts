import type { Column } from "./Column";

export interface DataTableProps<T extends object> {
  data: T[],
  columns: Column<T>[],
  rowKey: keyof T,
  loading?: boolean
}