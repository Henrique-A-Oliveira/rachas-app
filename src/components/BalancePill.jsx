import React from "react";
import { C } from "../theme/colors";

export default function BalancePill({ value }) {
  const positive = value >= 0;
  return (
    <div
      className="flex items-baseline gap-1 px-3 py-1.5 rounded-full"
      style={{ background: positive ? "rgba(47,143,111,0.15)" : "rgba(228,87,61,0.15)" }}
    >
      <span className="f-body text-xs font-medium" style={{ color: positive ? C.sea : C.coral }}>
        {positive ? "Devem-te" : "Deves"}
      </span>
      <span className="f-mono text-sm font-semibold" style={{ color: positive ? C.sea : C.coral }}>
        {Math.abs(value)}€
      </span>
    </div>
  );
}
