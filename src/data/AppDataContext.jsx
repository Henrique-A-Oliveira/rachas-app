import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { MEMBERS } from "./mockData";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    if (!user) {
      setTrips([]);
      setLoadingTrips(false);
      return;
    }
    setLoadingTrips(true);
    const q = query(collection(db, "trips"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Ordenar no cliente (mais recente primeiro) para não precisar de índice composto no Firestore.
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTrips(list);
      setLoadingTrips(false);
    });
    return unsubscribe;
  }, [user]);

  const createTrip = async ({ name, sub, dates }) => {
    await addDoc(collection(db, "trips"), {
      name,
      sub: sub || "Sem destino definido",
      dates: dates || "Datas por definir",
      // Nota: ainda não há convites reais — a lista de participantes é sempre
      // este grupo fixo (MEMBERS), por isso a contagem reflete isso mesmo,
      // e não quantas pessoas "convidaste" de verdade.
      members: MEMBERS.length,
      status: "ativa",
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  // Apaga a viagem e todas as despesas/pagamentos guardados lá dentro (subcoleção),
  // para não deixar dados "órfãos" perdidos no Firestore.
  const deleteTrip = async (tripId) => {
    const expensesRef = collection(db, "trips", tripId, "expenses");
    const snapshot = await getDocs(expensesRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, "trips", tripId));
    await batch.commit();
  };

  return (
    <AppDataContext.Provider value={{ trips, loadingTrips, members: MEMBERS, createTrip, deleteTrip }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData tem de ser usado dentro de <AppDataProvider>");
  return ctx;
}
