import React from "react";
import { C } from "../theme/colors";

export default function Avatar({ name, size = 32, tone = C.ink }) {
  return (
    <div
      className="flex items-center justify-center rounded-full f-body font-semibold shrink-0"
      style={{ width: size, height: size, background: tone, color: C.paper, fontSize: size * 0.4 }}
    >
      {name?.[0]}
    </div>
  );
}
