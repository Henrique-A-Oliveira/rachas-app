import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { CATS } from "./mockData";

export function useTripFeed(tripId) {
  const [feed, setFeed] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    setLoadingFeed(true);
    const ref = collection(db, "trips", tripId, "expenses");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setFeed(list);
      setLoadingFeed(false);
    });
    return unsubscribe;
  }, [tripId]);

  const saveExpense = async ({ id, amount, category, n, participants }) => {
    const ref = collection(db, "trips", tripId, "expenses");
    if (id) {
      await updateDoc(doc(ref, id), { desc: CATS[category].label, amount, category, n, participants });
    } else {
      await addDoc(ref, {
        type: "expense",
        person: "Tu",
        desc: CATS[category].label,
        amount,
        category,
        time: "Agora",
        n,
        participants,
        createdAt: serverTimestamp(),
      });
    }
  };

  const deleteExpense = async (id) => {
    await deleteDoc(doc(db, "trips", tripId, "expenses", id));
  };

  // Simplificação do MVP: assume-se que a liquidação é sempre feita com "Tu".
  const settle = async (name, balance) => {
    if (!balance) return;
    const ref = collection(db, "trips", tripId, "expenses");
    const payment =
      balance < 0
        ? { type: "payment", from: name, to: "Tu", amount: Math.abs(balance), time: "Agora" }
        : { type: "payment", from: "Tu", to: name, amount: Math.abs(balance), time: "Agora" };
    await addDoc(ref, { ...payment, createdAt: serverTimestamp() });
  };

  return { feed, loadingFeed, saveExpense, deleteExpense, settle };
}
