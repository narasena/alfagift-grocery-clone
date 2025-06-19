import * as React from "react";
import AdminTableHeader from "./AdminTableHeader";

export interface ITableColumn {
  key: string;
  label: string;
}

interface ICommonAdminTableProps<T> {
  title?: string;
  tableDescription?: string;
  linkHref?: string;
  linkLabel?: string;
  columns: ITableColumn[];
  data: T[];
  renderCell?: (row: T, key: string) => React.ReactNode | undefined;
}

interface IAdminTablePropsWithCheckbox<T> extends ICommonAdminTableProps<T> {
  withCheckbox: boolean;
  getRowId: (row:T) => string
  onCheckboxChange?: (checkedRows: string[]) => void;
  checkedRows?: string[];
}

interface IAdminTablePropsWithoutCheckbox<T> extends ICommonAdminTableProps<T> {
  withCheckbox?: false;
  getRowId?: never;
  onCheckboxChange?: never;
  checkedRows?: never;
}

export type IAdminTableProps<T> =
  | IAdminTablePropsWithCheckbox<T>
  | IAdminTablePropsWithoutCheckbox<T>;

export default function AdminTable<T extends Record<string, unknown>>(props: IAdminTableProps<T>) {
  const {
    title,
    tableDescription,
    linkHref,
    linkLabel,
    columns,
    data,
    renderCell,
    withCheckbox
  } = props

  const [internalChecked, setInternalChecked] = React.useState<string[]>([]);

  const isControlled = withCheckbox && Array.isArray(props.checkedRows);
  const checkedRows:string[] = isControlled ? (props as IAdminTablePropsWithCheckbox<T>).checkedRows! : internalChecked

  const handleCheckboxChangeInternal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rowId = event.target.value;
    const isChecked = event.target.checked 
    
    let newCheckedRows: string[]

    if (isChecked) {
      newCheckedRows = [...checkedRows, rowId]
    } else {
      newCheckedRows = checkedRows.filter((id) => id !== rowId)
    }
    setInternalChecked(newCheckedRows)
    if(withCheckbox && props.onCheckboxChange) props.onCheckboxChange(newCheckedRows)
  }
  React.useEffect(() => {
    console.log(checkedRows);
  },[checkedRows])
  return (
    <div className="relative !overflow-auto shadow-lg sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <AdminTableHeader title={title} tableDescription={tableDescription} linkHref={linkHref} linkLabel={linkLabel} />
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {withCheckbox && (
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    checked={data.length > 0 && checkedRows.length === data.length}
                    onChange={(event) => {
                      const allIds = event.target.checked
                        ? data.map((row) => props.getRowId(row))
                        : [];

                      setInternalChecked(allIds);
                      if (props.onCheckboxChange) props.onCheckboxChange(allIds);
                    }}
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
          {data.map((row, rowIndex) => {
            const rowId = withCheckbox ? props.getRowId(row): ""
            return (
              <tr key={rowIndex} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                {withCheckbox && (
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-${rowId}`}
                        type="checkbox"
                        checked={checkedRows.includes(rowId)}
                        value={rowId}
                        onChange={handleCheckboxChangeInternal}
                        className="size-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor={`checkbox-${rowId}`} className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col.key === "image" ? "p-1.5" : "px-6 py-4"}>
                    {renderCell ? renderCell(row, col.key) : String(row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
