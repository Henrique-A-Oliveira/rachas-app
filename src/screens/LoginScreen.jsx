import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { C } from "../theme/colors";
import { useAuth } from "../data/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { signInGoogle, signUpEmail, signInEmail } = useAuth();

  const [mode, setMode] = useState("entrar"); // "entrar" | "criar"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const friendlyError = (err) => {
    const code = err?.code || "";
    if (code.includes("auth/invalid-email")) return "Email inválido.";
    if (code.includes("auth/user-not-found") || code.includes("auth/wrong-password") || code.includes("auth/invalid-credential"))
      return "Email ou password incorretos.";
    if (code.includes("auth/email-already-in-use")) return "Já existe uma conta com este email.";
    if (code.includes("auth/weak-password")) return "A password precisa de pelo menos 6 caracteres.";
    if (code.includes("auth/popup-closed-by-user")) return "Fechaste a janela do Google antes de terminar.";
    return "Não foi possível entrar. Tenta novamente.";
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInGoogle();
      navigate("/viagens");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "criar") {
        await signUpEmail(email, password, name);
      } else {
        await signInEmail(email, password);
      }
      navigate("/viagens");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

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
        <p className="f-body text-sm text-center mb-8" style={{ color: "rgba(251,248,242,0.6)" }}>
          Regista despesas em grupo e vê sempre quem deve o quê.
        </p>

        <div className="w-full max-w-xs">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full f-body text-sm font-semibold py-3 rounded-full mb-5"
            style={{ background: C.paper, color: C.ink, opacity: loading ? 0.6 : 1 }}
          >
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "rgba(251,248,242,0.2)" }} />
            <span className="f-body text-xs" style={{ color: "rgba(251,248,242,0.4)" }}>ou</span>
            <div className="h-px flex-1" style={{ background: "rgba(251,248,242,0.2)" }} />
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {mode === "criar" && (
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="O teu nome"
                className="f-body text-sm px-4 py-3 rounded-2xl outline-none"
                style={{ background: "rgba(251,248,242,0.08)", color: C.paper }}
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="f-body text-sm px-4 py-3 rounded-2xl outline-none"
              style={{ background: "rgba(251,248,242,0.08)", color: C.paper }}
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="f-body text-sm px-4 py-3 rounded-2xl outline-none"
              style={{ background: "rgba(251,248,242,0.08)", color: C.paper }}
            />

            {error && (
              <p className="f-body text-xs text-center" style={{ color: C.coral }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="f-body text-sm font-semibold py-3 rounded-full border mt-1"
              style={{ borderColor: "rgba(251,248,242,0.3)", color: C.paper, opacity: loading ? 0.6 : 1 }}
            >
              {mode === "criar" ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "criar" ? "entrar" : "criar"); setError(""); }}
            className="f-body text-xs text-center w-full mt-4"
            style={{ color: "rgba(251,248,242,0.5)" }}
          >
            {mode === "criar" ? "Já tens conta? Entrar" : "Ainda não tens conta? Criar uma"}
          </button>
        </div>
      </div>
    </div>
  );
}
