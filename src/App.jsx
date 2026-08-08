import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppDataProvider } from "./data/AppDataContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import GroupScreen from "./screens/GroupScreen";

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/viagens" element={<HomeScreen />} />
          <Route path="/viagens/:id" element={<GroupScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppDataProvider>
  );
}
