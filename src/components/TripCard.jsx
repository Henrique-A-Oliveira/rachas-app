import React from "react";
import { Plane, Users } from "lucide-react";
import { C } from "../theme/colors";

export default function TripCard({ trip, onOpen }) {
  const isActive = trip.status === "ativa";
  return (
    <button onClick={() => onOpen(trip)} className="w-full text-left relative mb-4">
      <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
        <div className="flex items-stretch">
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-1">
              <span
                className="f-mono text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: isActive ? "rgba(47,143,111,0.12)" : "rgba(91,107,122,0.12)",
                  color: isActive ? C.sea : C.inkSoft,
                }}
              >
                {isActive ? "ATIVA" : "TERMINADA"}
              </span>
              <span className="f-mono text-xs" style={{ color: C.inkSoft }}>
                {trip.dates}
              </span>
            </div>
            <h3 className="f-display text-2xl" style={{ color: C.ink }}>
              {trip.name}
            </h3>
            <p className="f-body text-xs mb-3" style={{ color: C.inkSoft }}>
              {trip.sub}
            </p>
            <div className="flex items-center gap-1" style={{ color: C.inkSoft }}>
              <Users size={13} />
              <span className="f-body text-xs">{trip.members?.length || 0} amigos</span>
            </div>
          </div>
          <div className="relative flex items-center justify-center px-2" style={{ borderLeft: `2px dashed ${C.line}` }}>
            <Plane size={18} style={{ color: C.gold, transform: "rotate(45deg)" }} />
          </div>
        </div>
      </div>
    </button>
  );
}
