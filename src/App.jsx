import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./data/AuthContext";
import { AppDataProvider } from "./data/AppDataContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import GroupScreen from "./screens/GroupScreen";
import { C } from "./theme/colors";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.ink }}>
      <span className="f-body text-sm" style={{ color: "rgba(251,248,242,0.6)" }}>A carregar…</span>
    </div>
  );
}

// Só deixa passar se houver sessão iniciada; caso contrário manda para o login.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

// No ecrã de login, se já houver sessão iniciada, salta logo para a lista de viagens.
function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/viagens" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirectIfAuthed><LoginScreen /></RedirectIfAuthed>} />
      <Route path="/viagens" element={<RequireAuth><HomeScreen /></RequireAuth>} />
      <Route path="/viagens/:id" element={<RequireAuth><GroupScreen /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}
