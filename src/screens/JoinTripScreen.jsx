import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Plane } from "lucide-react";
import { C } from "../theme/colors";
import { useAuth } from "../data/AuthContext";
import { useAppData } from "../data/AppDataContext";

const PENDING_INVITE_KEY = "rachas_pending_invite";

export default function JoinTripScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("c") || "";
  const { user, loading: loadingAuth } = useAuth();
  const { joinTrip } = useAppData();
  const [status, setStatus] = useState("a-entrar"); // a-entrar | erro
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      // Guarda o convite para retomar assim que a pessoa iniciar sessão.
      sessionStorage.setItem(PENDING_INVITE_KEY, JSON.stringify({ id, code }));
      navigate("/");
      return;
    }

    (async () => {
      try {
        await joinTrip(id, code);
        sessionStorage.removeItem(PENDING_INVITE_KEY);
        navigate(`/viagens/${id}`);
      } catch (err) {
        setStatus("erro");
        setError(err.message || "Não foi possível entrar nesta viagem.");
      }
    })();
  }, [loadingAuth, user, id, code]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center gap-4" style={{ background: C.ink }}>
      <Plane size={26} style={{ color: C.gold, transform: "rotate(45deg)" }} />
      {status === "a-entrar" ? (
        <p className="f-body text-sm" style={{ color: "rgba(251,248,242,0.7)" }}>A entrar na viagem…</p>
      ) : (
        <>
          <p className="f-body text-sm" style={{ color: C.coral }}>{error}</p>
          <button
            onClick={() => navigate("/viagens")}
            className="f-body text-sm font-semibold px-5 py-3 rounded-full"
            style={{ background: C.paper, color: C.ink }}
          >
            Voltar às viagens
          </button>
        </>
      )}
    </div>
  );
}

export { PENDING_INVITE_KEY };
