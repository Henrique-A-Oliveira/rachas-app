import {
  Home as HomeIcon,
  Fuel,
  ShoppingBasket,
  UtensilsCrossed,
  PartyPopper,
} from "lucide-react";
import { C } from "../theme/colors";

export const CATS = {
  casa: { label: "Casa", icon: HomeIcon, color: C.ink },
  gasolina: { label: "Gasolina", icon: Fuel, color: C.gold },
  comida: { label: "Comida", icon: ShoppingBasket, color: C.sea },
  restaurantes: { label: "Restaurantes", icon: UtensilsCrossed, color: C.coral },
  diversao: { label: "Diversão", icon: PartyPopper, color: "#7A6CB0" },
};

export const MEMBERS = ["Tu", "Ana", "Pedro", "Sofia"];

export const INITIAL_TRIPS = [
  { id: 1, name: "Algarve", sub: "Lagos · Portugal", dates: "12–19 Jul", members: 4, status: "ativa" },
  { id: 2, name: "Roma", sub: "Itália", dates: "3–7 Mai", members: 3, status: "terminada" },
];

export const INITIAL_FEED = [
  { id: 1, type: "expense", person: "Ana", desc: "Jantar na praia", amount: 64, category: "restaurantes", time: "Qui, 14:32", n: 4, participants: MEMBERS },
  { id: 2, type: "payment", from: "Tu", to: "Ana", amount: 16, time: "Qui, 15:05" },
  { id: 3, type: "expense", person: "Tu", desc: "Gasolina A22", amount: 38, category: "gasolina", time: "Qua, 09:12", n: 4, participants: MEMBERS },
  { id: 4, type: "expense", person: "Pedro", desc: "Compras Continente", amount: 52.4, category: "comida", time: "Ter, 18:40", n: 4, participants: MEMBERS },
  { id: 5, type: "expense", person: "Ana", desc: "Bilhetes Zoomarine", amount: 80, category: "diversao", time: "Seg, 11:00", n: 4, participants: MEMBERS },
];
