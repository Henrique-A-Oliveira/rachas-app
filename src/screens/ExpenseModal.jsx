import React, { useState } from "react";
import { X } from "lucide-react";
import { C } from "../theme/colors";
import { CATS, MEMBERS } from "../data/mockData";

export default function ExpenseModal({ onClose, onSave, initial, onDelete }) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial ? initial.category : "restaurantes");
  const [selected, setSelected] = useState(initial ? initial.participants : MEMBERS);
  const isEditing = Boolean(initial);

  const toggle = (m) => setSelected((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));
  const canSave = amount && parseFloat(amount) > 0 && selected.length > 0;

  return (
    <div className="fixed inset-0 flex flex-col justify-end z-30" style={{ background: "rgba(30,42,56,0.5)" }}>
      <div className="rounded-t-3xl p-5 pb-8 max-w-md w-full mx-auto" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="f-display text-xl" style={{ color: C.ink }}>
            {isEditing ? "Editar despesa" : "Nova despesa"}
          </h3>
          <button onClick={onClose}>
            <X size={20} style={{ color: C.inkSoft }} />
          </button>
        </div>

        <div className="flex items-baseline justify-center gap-1 mb-6">
          <span className="f-mono text-2xl" style={{ color: C.inkSoft }}>€</span>
          <input
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            className="f-mono text-5xl font-semibold text-center bg-transparent outline-none"
            style={{ color: C.ink, width: 140 }}
          />
        </div>

        <p className="f-body text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: C.inkSoft }}>
          Categoria
        </p>
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {Object.entries(CATS).map(([key, cat]) => {
            const Icon = cat.icon;
            const active = category === key;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl shrink-0"
                style={{ background: active ? C.ink : "rgba(30,42,56,0.06)" }}
              >
                <Icon size={16} style={{ color: active ? C.paper : cat.color }} />
                <span className="f-body text-xs" style={{ color: active ? C.paper : C.inkSoft }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="f-body text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: C.inkSoft }}>
          Quem está envolvido
        </p>
        <div className="flex gap-2 mb-6">
          {MEMBERS.map((m) => {
            const active = selected.includes(m);
            return (
              <button key={m} onClick={() => toggle(m)} className="flex flex-col items-center gap-1">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: active ? C.gold : "rgba(30,42,56,0.08)",
                    color: active ? C.paper : C.inkSoft,
                    border: active ? "none" : `1px solid ${C.line}`,
                  }}
                >
                  <span className="f-body text-xs font-semibold">{m[0]}</span>
                </div>
                <span className="f-body text-xs" style={{ color: C.inkSoft }}>
                  {m}
                </span>
              </button>
            );
          })}
        </div>

        <button
          disabled={!canSave}
          onClick={() => {
            onSave({ id: initial?.id, amount: parseFloat(amount), category, n: selected.length, participants: selected });
            onClose();
          }}
          className="w-full f-body text-sm font-semibold py-3 rounded-full"
          style={{ background: canSave ? C.coral : C.line, color: C.paper }}
        >
          {isEditing ? "Guardar alterações" : "Guardar despesa"}
        </button>

        {isEditing && (
          <button
            onClick={() => {
              onDelete(initial.id);
              onClose();
            }}
            className="w-full f-body text-sm font-semibold py-3 mt-3 rounded-full"
            style={{ background: "transparent", color: C.coral, border: `1px solid ${C.coral}` }}
          >
            Apagar despesa
          </button>
        )}
      </div>
    </div>
  );
}
