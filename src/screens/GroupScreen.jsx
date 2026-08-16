import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Check, Trash2, UserPlus, Copy } from "lucide-react";
import { C } from "../theme/colors";
import { computeBalances } from "../utils/balances";
import { formatEuro } from "../utils/format";
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
  const { trips, deleteTrip } = useAppData();
  const { feed, loadingFeed, saveExpense, deleteExpense, settle, myName } = useTripFeed(id);
  const [deleting, setDeleting] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  // Prioriza a versão em tempo real (para refletir novos membros a entrar);
  // usa o estado da navegação só como fallback para o primeiro render.
  const trip = trips.find((t) => t.id === id) || location.state?.trip;

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

  const handleDeleteTrip = async () => {
    if (!window.confirm(`Apagar a viagem "${trip.name}"? Isto apaga também todas as despesas registadas. Não se pode desfazer.`)) {
      return;
    }
    setDeleting(true);
    try {
      await deleteTrip(id);
      navigate("/viagens");
    } catch (err) {
      alert("Não foi possível apagar a viagem. Tenta novamente.");
      setDeleting(false);
    }
  };

  const members = trip.members || [];
  const memberNames = members.map((m) => m.name);
  const balances = computeBalances(feed, memberNames);
  const yourBalance = balances[myName] || 0;

  const totals = {};
  feed.forEach((f) => {
    if (f.type === "expense") totals[f.category] = (totals[f.category] || 0) + f.amount;
  });
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);

  const people = memberNames.filter((name) => name !== myName).map((name) => ({
    name,
    balance: Math.round((balances[name] || 0) * 100) / 100,
  }));

  const inviteLink = `${window.location.origin}${window.location.pathname}#/entrar/${trip.id}?c=${trip.inviteCode}`;
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia o link do convite:", inviteLink);
    }
  };

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
                {memberNames.length} amigos
              </span>
            </div>
            <BalancePill value={yourBalance} />
            <button onClick={() => setShowInvite(true)}>
              <UserPlus size={18} color="rgba(251,248,242,0.6)" />
            </button>
            <button onClick={handleDeleteTrip} disabled={deleting} style={{ opacity: deleting ? 0.5 : 1 }}>
              <Trash2 size={18} color="rgba(251,248,242,0.6)" />
            </button>
          </div>
          <div className="flex px-4 gap-6">
            {[
              ["feed", "Chat"],
              ["balances", "Saldos"],
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
        {tab === "feed" && (
          feed.slice().reverse().map((item) => <FeedRow key={item.id} item={item} onEdit={setEditingExpense} />)
        )}

        {tab === "balances" && (
          <>
            <p className="f-body text-sm mb-4" style={{ color: C.inkSoft }}>
              Aqui vês, de forma direta, quanto deves a cada pessoa ou quanto cada pessoa te deve a ti.
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              {people.length === 0 ? (
                <p className="f-body text-sm p-4" style={{ color: C.inkSoft }}>
                  Ainda não há mais ninguém nesta viagem.
                </p>
              ) : (
                people.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < people.length - 1 ? `1px solid ${C.line}` : "none" }}>
                    <Avatar name={p.name} size={28} tone={C.inkSoft} />
                    <div className="flex-1">
                      {p.balance !== 0 ? (
                        <span className="f-body text-sm" style={{ color: C.ink }}>
                          {p.balance < 0 ? (
                            <>
                              <span style={{ color: C.inkSoft }}>{p.name} deve-te </span>
                              <span className="f-mono font-semibold" style={{ color: C.sea }}>{formatEuro(Math.abs(p.balance))}€</span>
                            </>
                          ) : (
                            <>
                              <span style={{ color: C.inkSoft }}>Deves </span>
                              <span className="f-mono font-semibold" style={{ color: C.coral }}>{formatEuro(p.balance)}€</span>
                              <span style={{ color: C.inkSoft }}> a {p.name}</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="f-body text-sm" style={{ color: C.ink }}>{p.name}</span>
                      )}
                    </div>
                    {p.balance === 0 ? (
                      <span className="f-body text-xs flex items-center gap-1" style={{ color: C.sea }}>
                        <Check size={13} /> Saldado
                      </span>
                    ) : (
                      <button onClick={() => settle(p.name, p.balance)} className="f-body text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: C.ink, color: C.paper }}>
                        Marcar pago
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "summary" && (
          <>
            <div className="rounded-2xl p-4 mb-4" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <p className="f-body text-xs mb-1" style={{ color: C.inkSoft }}>Total gasto na viagem</p>
              <p className="f-mono text-3xl font-semibold" style={{ color: C.ink }}>{totalSpent.toFixed(0)}€</p>
            </div>

            <p className="f-body text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: C.inkSoft }}>Por categoria</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
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
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ background: C.coral }}>
        <Plus size={24} color={C.paper} />
      </button>

      {showAdd && (
        <ExpenseModal
          members={members}
          onClose={() => setShowAdd(false)}
          onSave={(data) => { saveExpense(data); setTab("feed"); }}
        />
      )}
      {editingExpense && (
        <ExpenseModal
          members={members}
          initial={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(data) => { saveExpense(data); setTab("feed"); }}
          onDelete={deleteExpense}
        />
      )}
      {showInvite && (
        <div className="fixed inset-0 flex flex-col justify-end z-30" style={{ background: "rgba(30,42,56,0.5)" }} onClick={() => setShowInvite(false)}>
          <div className="rounded-t-3xl p-5 pb-8 max-w-md w-full mx-auto" style={{ background: C.paper }} onClick={(e) => e.stopPropagation()}>
            <h3 className="f-display text-xl mb-2" style={{ color: C.ink }}>Convidar amigos</h3>
            <p className="f-body text-sm mb-4" style={{ color: C.inkSoft }}>
              Partilha este link — quem entrar (autenticado) junta-se logo à viagem.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-2xl mb-4" style={{ background: "rgba(30,42,56,0.06)" }}>
              <span className="f-mono text-xs flex-1 truncate" style={{ color: C.ink }}>{inviteLink}</span>
            </div>
            <button
              onClick={copyInviteLink}
              className="w-full flex items-center justify-center gap-2 f-body text-sm font-semibold py-3 rounded-full"
              style={{ background: C.coral, color: C.paper }}
            >
              <Copy size={16} /> {copied ? "Copiado!" : "Copiar link"}
            </button>
            <button
              onClick={() => setShowInvite(false)}
              className="w-full f-body text-sm font-medium py-3 mt-2 rounded-full"
              style={{ color: C.inkSoft }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
