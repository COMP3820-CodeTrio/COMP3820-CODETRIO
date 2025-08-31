import { auth } from "./firebase";
import { onAuthStateChanged, getIdTokenResult, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Claims = { role?: "admin" | "clinician" | "coordinator"; teamId?: string };
type AuthCtx = {
  user: User | null;
  claims: Claims;
  loading: boolean;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  claims: {},
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claims>({});
  const [loading, setLoading] = useState(true);

  async function load(u: User | null, force = false) {
    setLoading(true);
    if (!u) {
      setUser(null);
      setClaims({});
      setLoading(false);
      return;
    }
    const token = await getIdTokenResult(u, force); // force=true refreshes custom claims
    setUser(u);
    setClaims({
      role: token.claims.role as any,
      teamId: token.claims.teamId as any,
    });
    setLoading(false);
  }

  useEffect(() => {
    // subscribe to auth state; refresh claims on first load
    return onAuthStateChanged(auth, (u) => void load(u, true));
  }, []);

  return (
    <Ctx.Provider value={{ user, claims, loading, refresh: () => load(auth.currentUser, true) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
