import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, Bill, User } from "../types";
import { initialProducts } from "../data/products";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  bills: Bill[];
  setBills: (b: Bill[]) => void;
  users: User[];
  setUsers: (u: User[]) => void;
  nextBillNo: () => string;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USERS: User[] = [
  { id: "u1", name: "Raghavendra", mobile: "9513803912", role: "admin" },
  { id: "u2", name: "Staff", mobile: "0000000000", role: "staff" },
];

function load<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    load("nm_current_user", null)
  );
  const [products, setProductsState] = useState<Product[]>(() =>
    load("nm_products", initialProducts)
  );
  const [bills, setBillsState] = useState<Bill[]>(() => load("nm_bills", []));
  const [users, setUsersState] = useState<User[]>(() =>
    load("nm_users", DEFAULT_USERS)
  );

  const persist = <T,>(key: string, val: T, setter: (v: T) => void) => {
    setter(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  useEffect(() => {
    localStorage.setItem("nm_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const setProducts = (p: Product[]) => persist("nm_products", p, setProductsState);
  const setBills = (b: Bill[]) => persist("nm_bills", b, setBillsState);
  const setUsers = (u: User[]) => persist("nm_users", u, setUsersState);

  const nextBillNo = () => {
    const count = bills.length + 1;
    return `NM-${String(count).padStart(4, "0")}`;
  };

  return (
    <AppContext.Provider
      value={{ currentUser, setCurrentUser, products, setProducts, bills, setBills, users, setUsers, nextBillNo }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
