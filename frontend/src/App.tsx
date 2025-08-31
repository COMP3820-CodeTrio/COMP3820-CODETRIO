import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db, fns } from "./lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "./lib/auth";

function Login() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("coordinator@example.com");
  const [password, setPassword] = useState("Password123!");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email, password);
        await refresh(); // pull latest claims
        nav("/dashboard");
      }}
    >
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Sign In</button>
    </form>
  );
}

function Dashboard() {
  const { claims } = useAuth();
  const [rows, setRows] = useState<any[]>([]);

  async function load() {
    const snap = await getDocs(query(collection(db, "communications"), orderBy("dateReceived", "desc")));
    setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  useEffect(() => { load(); }, []);

  async function markActioned(id: string) {
    const call = httpsCallable(fns, "markActioned");
    await call({ commId: id });
    await load();
  }

  return (
    <>
      <h2>Items Requiring Action</h2>
      <table>
        <thead>
          <tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.type}</td>
              <td>{r.status}</td>
              <td>{r.dateReceived?.toDate?.().toLocaleDateString?.() ?? ""}</td>
              <td>
                {(claims.role === "admin" || claims.role === "coordinator" || claims.role === "clinician") && (
                  <button onClick={() => markActioned(r.id)}>Mark actioned</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link to="/">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
