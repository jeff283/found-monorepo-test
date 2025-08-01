'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No records found.",
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={col.className || "caption text-muted-foreground"}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 caption text-muted"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-muted/30 cursor-pointer ${rowClassName?.(row) || ""}`}
              >
                {columns.map((col, j) => (
                  <TableCell key={j} className="body-small">
                    {col.render
                      ? col.render(
                          col.accessor ? row[col.accessor] : undefined,
                          row
                        )
                      : col.accessor
                      ? String(row[col.accessor])
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
