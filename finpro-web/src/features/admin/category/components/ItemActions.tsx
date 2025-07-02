import * as React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";

export default function ItemActions() {
  const actions = [
    {
      key: "view",
      label: "View",
      icon: <GrView />,
      textColor: "text-slate-400 hover:text-slate-300",
      style: "bg-slate-800 hover:bg-slate-700 border border-slate-400",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <FaEdit />,
      textColor: "text-white hover:text-slate-100",
      style: "bg-blue-800 hover:bg-blue-700 border border-blue-500",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <AiFillDelete />,
      textColor: "text-white hover:text-slate-100 ",
      style: "bg-red-800 hover:bg-red-700 border border-red-500",
    },
  ];
  const [labelVisible, setLabelVisible] = React.useState(false);
  const [visibleIndex, setVisibleIndex] = React.useState(-1);

  return (
    <div className="text-xs font-light flex items-center gap-1.5">
      {actions.map((action, index) => (
        <div
          key={index}
          className={
            "w-max flex items-center gap-1 py-0.5 px-1.5 rounded-sm group cursor-pointer " +
            action.style +
            " " +
            action.textColor +
            " " +
            (index === visibleIndex ? "font-normal" : "font-medium")
          }
          onMouseEnter={() => {
            setLabelVisible(true);
            setVisibleIndex(index);
          }}
          onMouseLeave={() => {
            setLabelVisible(false);
            setVisibleIndex(-1);
          }}
        >
          {action.icon}
          {labelVisible && index === visibleIndex && <span className={`${action.textColor}`}>{action.label}</span>}
        </div>
      ))}
    </div>
  );
}
