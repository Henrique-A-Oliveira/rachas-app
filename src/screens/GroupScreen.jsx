import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { C } from "../theme/colors";
import { computeBalances } from "../utils/balances";
import { CATS } from "../data/mockData";
import { useAppData } from "../data/AppDataContext";
import { useTripFeed } from "../data/useTripFeed";
import Avatar from "../components/Avatar";
import BalancePill from "../components/BalancePill";
import FeedRow from "../components/FeedRow";
import ExpenseModal from "./ExpenseModal";

export default function GroupScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { trips, members } = useAppData();
  const { feed, loadingFeed, saveExpense, deleteExpense, settle } = useTripFeed(id);

  const trip = location.state?.trip || trips.find((t) => t.id === id);

  const [tab, setTab] = useState("feed");
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: C.sand }}>
        <p className="f-body text-sm" style={{ color: C.inkSoft }}>
          {loadingFeed ? "A carregar…" : "Viagem não encontrada."}
        </p>
        {!loadingFeed && (
          <button onClick={() => navigate("/viagens")} className="f-body text-sm font-semibold px-4 py-2 rounded-full" style={{ background: C.ink, color: C.paper }}>
            Voltar às viagens
          </button>
        )}
      </div>
    );
  }

  const balances = computeBalances(feed, members);
  const yourBalance = balances["Tu"] || 0;

  const totals = {};
  feed.forEach((f) => {
    if (f.type === "expense") totals[f.category] = (totals[f.category] || 0) + f.amount;
  });
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);

  const people = members.filter((m) => m !== "Tu").map((name) => ({
    name,
    balance: Math.round((balances[name] || 0) * 100) / 100,
  }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.sand }}>
      <div style={{ background: C.ink }}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-4">
            <button onClick={() => navigate("/viagens")}>
              <ArrowLeft size={20} color={C.paper} />
            </button>
            <div className="flex-1">
              <h2 className="f-display text-lg leading-tight" style={{ color: C.paper }}>
                {trip.name}
              </h2>
              <span className="f-body text-xs" style={{ color: "rgba(251,248,242,0.55)" }}>
                {trip.members} amigos
              </span>
            </div>
            <BalancePill value={yourBalance} />
          </div>
          <div className="flex px-4 gap-6">
            {[
              ["feed", "Chat"],
              ["summary", "Resumo"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className="pb-3 f-body text-sm font-medium relative" style={{ color: tab === key ? C.paper : "rgba(251,248,242,0.45)" }}>
                {label}
                {tab === key && <div className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: C.gold }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-24">
        {tab === "feed" ? (
          feed.slice().reverse().map((item) => <FeedRow key={item.id} item={item} onEdit={setEditingExpense} />)
        ) : (
          <>
            <div className="rounded-2xl p-4 mb-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <p className="f-body text-xs mb-1" style={{ color: C.inkSoft }}>Total gasto na viagem</p>
              <p className="f-mono text-3xl font-semibold" style={{ color: C.ink }}>{totalSpent.toFixed(0)}€</p>
            </div>

            <p className="f-body text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: C.inkSoft }}>Por categoria</p>
            <div className="rounded-2xl mb-4 overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              {Object.entries(totals).map(([key, val], i, arr) => {
                const cat = CATS[key];
                const Icon = cat.icon;
                return (
                  <div key={key} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${cat.color}22` }}>
                      <Icon size={15} style={{ color: cat.color }} />
                    </div>
                    <span className="flex-1 f-body text-sm" style={{ color: C.ink }}>{cat.label}</span>
                    <span className="f-mono text-sm font-semibold" style={{ color: C.ink }}>{val.toFixed(0)}€</span>
                  </div>
                );
              })}
            </div>

            <p className="f-body text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: C.inkSoft }}>Por pessoa</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              {people.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < people.length - 1 ? `1px solid ${C.line}` : "none" }}>
                  <Avatar name={p.name} size={28} tone={C.inkSoft} />
                  <span className="flex-1 f-body text-sm" style={{ color: C.ink }}>{p.name}</span>
                  {p.balance === 0 ? (
                    <span className="f-body text-xs flex items-center gap-1" style={{ color: C.sea }}>
                      <Check size={13} /> Saldado
                    </span>
                  ) : (
                    <>
                      <span className="f-mono text-xs font-semibold" style={{ color: p.balance > 0 ? C.sea : C.coral }}>
                        {p.balance > 0 ? `+${p.balance}€` : `${p.balance}€`}
                      </span>
                      <button onClick={() => settle(p.name, p.balance)} className="f-body text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.ink, color: C.paper }}>
                        Marcar pago
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ background: C.coral }}>
        <Plus size={24} color={C.paper} />
      </button>

      {showAdd && (
        <ExpenseModal
          onClose={() => setShowAdd(false)}
          onSave={(data) => { saveExpense(data); setTab("feed"); }}
        />
      )}
      {editingExpense && (
        <ExpenseModal
          initial={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(data) => { saveExpense(data); setTab("feed"); }}
          onDelete={deleteExpense}
        />
      )}
    </div>
  );
}
