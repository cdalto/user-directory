import type { DataTableProps } from "@/types/DataTableProps";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

export function DataTable<T extends object>({
  data,
  columns,
  rowKey,
  loading
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(() => columns[0]?.key ?? null)
  const [sortAscending, setSortAscending] = useState(true)

  function sortRows(key: keyof T) {
    if (sortKey === key) {
      setSortAscending(a => !a)
    } else {
      setSortKey(key)
      setSortAscending(true)
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
      const col = columns.find(c => c.key === sortKey)
      const av = col?.sortValue ? col.sortValue(a[sortKey]) : a[sortKey]
      const bv = col?.sortValue ? col.sortValue(b[sortKey]) : b[sortKey]
      if (av < bv) return sortAscending ? -1 : 1
      if (av > bv) return sortAscending ? 1 : -1
      return 0
    })
    : data

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={column.key.toString()} onClick={column.sortable ? () => sortRows(column.key) : undefined}>
              {column.header}
              {sortKey === column.key && (sortAscending ? ' ↑' : ' ↓')}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {!loading && !sortedData.length && <TableCaption>No users found.</TableCaption>}
      <TableBody>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {columns.map(column => (
                <TableCell key={column.key.toString()}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
          : sortedData.map(row => (
            <TableRow key={String(row[rowKey])}>
              {columns.map(column => (
                <TableCell key={column.key.toString()}>
                  {column.render
                    ? column.render(row[column.key as keyof T])
                    : String(row[column.key as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table >
  )
}