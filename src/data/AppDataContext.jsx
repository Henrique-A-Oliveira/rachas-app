import React, { createContext, useContext, useState } from "react";
import { INITIAL_TRIPS, INITIAL_FEED, CATS, MEMBERS } from "../data/mockData";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  // Nota: o feed ainda é partilhado por todas as viagens (mock global), tal
  // como no protótipo. Isolar por viagem fica para quando ligar a uma base de dados real.
  const [feed, setFeed] = useState(INITIAL_FEED);

  const createTrip = ({ name, sub, dates }) => {
    const newTrip = {
      id: Date.now(),
      name,
      sub: sub || "Sem destino definido",
      dates: dates || "Datas por definir",
      members: 1,
      status: "ativa",
    };
    setTrips((t) => [newTrip, ...t]);
  };

  const saveExpense = ({ id, amount, category, n, participants }) => {
    if (id) {
      setFeed((f) =>
        f.map((item) =>
          item.id === id ? { ...item, desc: CATS[category].label, amount, category, n, participants } : item
        )
      );
    } else {
      setFeed((f) => [
        ...f,
        { id: Date.now(), type: "expense", person: "Tu", desc: CATS[category].label, amount, category, time: "Agora", n, participants },
      ]);
    }
  };

  const deleteExpense = (id) => setFeed((f) => f.filter((item) => item.id !== id));

  // Simplificação do MVP: assume-se que a liquidação é sempre feita com "Tu".
  const settle = (name, balance) => {
    if (!balance) return;
    const payment =
      balance < 0
        ? { id: Date.now(), type: "payment", from: name, to: "Tu", amount: Math.abs(balance), time: "Agora" }
        : { id: Date.now(), type: "payment", from: "Tu", to: name, amount: Math.abs(balance), time: "Agora" };
    setFeed((f) => [...f, payment]);
  };

  return (
    <AppDataContext.Provider value={{ trips, feed, members: MEMBERS, createTrip, saveExpense, deleteExpense, settle }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData tem de ser usado dentro de <AppDataProvider>");
  return ctx;
}
