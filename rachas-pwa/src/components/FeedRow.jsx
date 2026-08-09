import React from "react";
import { Check } from "lucide-react";
import { C } from "../theme/colors";
import { CATS } from "../data/mockData";
import Avatar from "./Avatar";

export default function FeedRow({ item, onEdit }) {
  if (item.type === "payment") {
    return (
      <div className="flex items-center gap-2 justify-center my-2">
        <div className="h-px flex-1" style={{ background: C.line }} />
        <div className="flex items-center gap-1.5 f-body text-xs px-3 py-1 rounded-full" style={{ background: "rgba(47,143,111,0.1)", color: C.sea }}>
          <Check size={12} />
          {item.from} pagou {item.amount}€ a {item.to}
        </div>
        <div className="h-px flex-1" style={{ background: C.line }} />
      </div>
    );
  }

  const cat = CATS[item.category];
  const Icon = cat.icon;

  return (
    <button onClick={() => onEdit(item)} className="flex gap-3 mb-4 w-full text-left">
      <Avatar name={item.person} />
      <div className="flex-1">
        <div className="rounded-2xl rounded-tl-sm p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="f-body text-xs font-semibold" style={{ color: C.ink }}>
              {item.person}
            </span>
            <span className="f-mono text-xs" style={{ color: C.inkSoft }}>
              {item.time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${cat.color}22` }}>
                <Icon size={13} style={{ color: cat.color }} />
              </div>
              <span className="f-body text-sm" style={{ color: C.ink }}>
                {item.desc}
              </span>
            </div>
            <span className="f-mono text-sm font-semibold" style={{ color: C.ink }}>
              {item.amount}€
            </span>
          </div>
          <p className="f-body text-xs mt-1" style={{ color: C.inkSoft }}>
            dividido por {item.n}
          </p>
        </div>
      </div>
    </button>
  );
}
