import React from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { C } from "../theme/colors";

export default function LoginScreen() {
  const navigate = useNavigate();
  const onLogin = () => navigate("/viagens");

  return (
    <div className="flex flex-col min-h-screen" style={{ background: C.ink }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="flex items-center gap-2 mb-2">
          <Plane size={22} style={{ color: C.gold, transform: "rotate(45deg)" }} />
          <span className="f-mono text-xs tracking-widest" style={{ color: C.gold }}>
            RACHAS
          </span>
        </div>
        <h1 className="f-display text-4xl text-center mb-2" style={{ color: C.paper }}>
          Organiza as despesas
          <br />
          da viagem, sem confusões.
        </h1>
        <p className="f-body text-sm text-center mb-10" style={{ color: "rgba(251,248,242,0.6)" }}>
          Regista despesas em grupo e vê sempre quem deve o quê.
        </p>
        <div className="w-full max-w-xs flex flex-col gap-3">
          <button onClick={onLogin} className="f-body text-sm font-semibold py-3 rounded-full" style={{ background: C.paper, color: C.ink }}>
            Continuar com Google
          </button>
          <button onClick={onLogin} className="f-body text-sm font-semibold py-3 rounded-full border" style={{ borderColor: "rgba(251,248,242,0.3)", color: C.paper }}>
            Continuar com Apple
          </button>
        </div>
      </div>
    </div>
  );
}
