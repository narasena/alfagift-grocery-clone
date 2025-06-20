import Link from 'next/link';
import * as React from 'react';

interface IAdminProductTableCellDataLinkProps{
  hrefLink: string;
  hrefLabel: string;
  style?: string;}


export default function AdminProductTableCellDataLink (props:IAdminProductTableCellDataLinkProps 
) {
  return (
    <div>
      <Link href={props.hrefLink||'#'} className={props.style || "text-blue-600 hover:underline hover:font-medium"}>
        {props.hrefLabel || "—"}
      </Link>
    </div>
  );
}
