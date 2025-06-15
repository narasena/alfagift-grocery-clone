import Link from "next/link";
import * as React from "react";

export interface ITableColumn {
  key: string;
  label: string;
}

interface IAdminListTableProps<T> {
  title?: string;
  tableDescription?: string;
  linkHref?: string;
  linkLabel?: string;
  columns: ITableColumn[];
  data: T[];
  withCheckbox?: boolean;
  renderCell?: (row: T, key: string) => React.ReactNode;
}

export default function AdminTable<T extends Record<string, unknown>>({
  title,
  tableDescription,
  linkHref,
  linkLabel,
  columns,
  data,
  withCheckbox,
  renderCell,
}: IAdminListTableProps<T>) {
  return (
    <div className="relative !overflow-auto shadow-lg sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          {title}
          <p className="mt-1 text-sm font-normal text-gray-500">
            {tableDescription}
            {linkHref && (
              <Link href={linkHref} className="font-medium text-blue-600 hover:underline">
                {linkLabel}
              </Link>
            )}
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {withCheckbox && (
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
            )}
            {columns.map((col, index) => (
              <th scope="col" key={index} className="px-6 py-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b border-gray-200 hover:bg-gray-50">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${rowIndex}`}
                    type="checkbox"
                    className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor={`checkbox-table-search-${rowIndex}`} className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={col.key === "image" ? "p-1.5" : "px-6 py-4"}>
                  {renderCell ? renderCell(row, col.key) : String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
