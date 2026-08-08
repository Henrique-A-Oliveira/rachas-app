import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Plus, X } from "lucide-react";
import { C } from "../theme/colors";
import { useAppData } from "../data/AppDataContext";
import Avatar from "../components/Avatar";
import TripCard from "../components/TripCard";

function CreateTripModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [dates, setDates] = useState("");
  const canSave = name.trim().length > 0;

  return (
    <div className="fixed inset-0 flex flex-col justify-end z-30" style={{ background: "rgba(30,42,56,0.5)" }}>
      <div className="rounded-t-3xl p-5 pb-8 max-w-md w-full mx-auto" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="f-display text-xl" style={{ color: C.ink }}>
            Nova viagem
          </h3>
          <button onClick={onClose}>
            <X size={20} style={{ color: C.inkSoft }} />
          </button>
        </div>

        <p className="f-body text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: C.inkSoft }}>
          Nome da viagem
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Algarve"
          className="w-full f-body text-sm mb-4 px-4 py-3 rounded-2xl outline-none"
          style={{ background: "rgba(30,42,56,0.06)", color: C.ink }}
        />

        <p className="f-body text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: C.inkSoft }}>
          Destino
        </p>
        <input
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          placeholder="Ex: Lagos · Portugal"
          className="w-full f-body text-sm mb-4 px-4 py-3 rounded-2xl outline-none"
          style={{ background: "rgba(30,42,56,0.06)", color: C.ink }}
        />

        <p className="f-body text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: C.inkSoft }}>
          Datas
        </p>
        <input
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          placeholder="Ex: 12–19 Jul"
          className="w-full f-body text-sm mb-6 px-4 py-3 rounded-2xl outline-none"
          style={{ background: "rgba(30,42,56,0.06)", color: C.ink }}
        />

        <button
          disabled={!canSave}
          onClick={() => onSave({ name: name.trim(), sub: sub.trim(), dates: dates.trim() })}
          className="w-full f-body text-sm font-semibold py-3 rounded-full"
          style={{ background: canSave ? C.coral : C.line, color: C.paper }}
        >
          Criar viagem
        </button>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { trips, createTrip } = useAppData();
  const [showCreateTrip, setShowCreateTrip] = useState(false);

  const openTrip = (trip) => navigate(`/viagens/${trip.id}`, { state: { trip } });

  const handleCreate = (data) => {
    createTrip(data);
    setShowCreateTrip(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.sand }}>
      <div style={{ background: C.ink }}>
        <div className="flex items-center justify-between px-5 py-4 max-w-md mx-auto">
          <h1 className="f-display text-2xl" style={{ color: C.paper }}>
            As tuas viagens
          </h1>
          <Avatar name="Tu" tone={C.gold} />
        </div>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-4 pt-5 pb-24 relative">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 px-10 text-center mt-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(30,42,56,0.06)" }}>
              <Plane size={30} style={{ color: C.ink, transform: "rotate(45deg)" }} />
            </div>
            <h3 className="f-display text-xl mb-1" style={{ color: C.ink }}>
              Ainda não tens viagens
            </h3>
            <p className="f-body text-sm mb-6" style={{ color: C.inkSoft }}>
              Cria a tua primeira viagem e convida os amigos.
            </p>
            <button onClick={() => setShowCreateTrip(true)} className="f-body text-sm font-semibold px-5 py-3 rounded-full shadow-md" style={{ background: C.coral, color: C.paper }}>
              + Criar viagem
            </button>
          </div>
        ) : (
          trips.map((t) => <TripCard key={t.id} trip={t} onOpen={openTrip} />)
        )}

        {trips.length > 0 && (
          <button
            onClick={() => setShowCreateTrip(true)}
            className="fixed bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: C.coral }}
          >
            <Plus size={24} color={C.paper} />
          </button>
        )}
      </div>

      {showCreateTrip && <CreateTripModal onClose={() => setShowCreateTrip(false)} onSave={handleCreate} />}
    </div>
  );
}
