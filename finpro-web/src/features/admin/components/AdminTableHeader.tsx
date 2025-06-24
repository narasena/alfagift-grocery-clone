import * as React from "react";
import { IAdminTableProps } from "./AdminTable";
import Link from "next/link";

type TAdminTableHeaderProps = Pick<IAdminTableProps<unknown>, "title" | "tableDescription" | "linkHref" | "linkLabel">;

export default function AdminTableHeader({
  title = "",
  tableDescription = "",
  linkHref = "#",
  linkLabel = "",
}: TAdminTableHeaderProps) {
  return (
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
  );
}
