import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
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
      members: 1,
      status: "ativa",
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <AppDataContext.Provider value={{ trips, loadingTrips, members: MEMBERS, createTrip }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData tem de ser usado dentro de <AppDataProvider>");
  return ctx;
}
