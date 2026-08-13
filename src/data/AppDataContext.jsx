import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const AppDataContext = createContext(null);

// Código de convite curto e fácil de meter num link (ex: "K3F7QX").
function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 para evitar confusões
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

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
    // array-contains: mostra viagens onde o utilizador é membro, não só o dono.
    const q = query(collection(db, "trips"), where("memberIds", "array-contains", user.uid));
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
    const me = { uid: user.uid, name: user.displayName || user.email || "Tu" };
    await addDoc(collection(db, "trips"), {
      name,
      sub: sub || "Sem destino definido",
      dates: dates || "Datas por definir",
      status: "ativa",
      ownerId: user.uid,
      memberIds: [user.uid],
      members: [me],
      inviteCode: generateInviteCode(),
      createdAt: serverTimestamp(),
    });
  };

// Entrar numa viagem através de um link de convite (id + código).
  // Não faz leitura prévia (isso exigiria abrir a leitura a todos os autenticados,
  // o que expunha dados de viagens a quem não devia). Em vez disso, tenta logo
  // escrever-se como membro, enviando o código junto — é o próprio Firestore
  // que valida o código nas regras de segurança, e recusa o pedido se estiver errado.
  const joinTrip = async (tripId, inviteCode) => {
    const tripRef = doc(db, "trips", tripId);
    const me = { uid: user.uid, name: user.displayName || user.email || "Convidado" };
    try {
      await updateDoc(tripRef, {
        memberIds: arrayUnion(user.uid),
        members: arrayUnion(me),
        joinCode: inviteCode,
      });
    } catch (err) {
      throw new Error("Não foi possível entrar nesta viagem. Confirma que o link está completo e correto.");
    }
    return { id: tripId };
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
    <AppDataContext.Provider value={{ trips, loadingTrips, createTrip, deleteTrip, joinTrip }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData tem de ser usado dentro de <AppDataProvider>");
  return ctx;
}
