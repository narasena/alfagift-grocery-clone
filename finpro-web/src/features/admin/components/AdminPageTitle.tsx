import * as React from "react";

export interface IAdminPageTitleProps {
  title: string;
  subTitle?: string;
}

export default function AdminPageTitle(props: IAdminPageTitleProps) {
  return (
    <div className="c-border-web w-full px-4 py-3 lg:px-6 lg:py-4">
      <span className="page-title">{props.title}</span>
      {props.subTitle && <p className="page-subtitle">{props.subTitle}</p>}
    </div>
  );
}
