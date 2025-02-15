"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Navbar.module.css";

export default function Navbar({ user, setUser }) {
  // ✅ setUser este acum definit corect
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null); // ✅ Resetează utilizatorul după logout
      router.push("/auth/login"); // 🔄 Redirecționează spre login
    } catch (error) {
      console.error("Eroare la logout:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>Transport App</h1>
      <div className={styles.user}>
        <div>
          {user ? (
            <span>Bun venit, {user.name}!</span>
          ) : (
            <span>Nu ești autentificat</span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Deconectare
        </button>
      </div>
    </nav>
  );
}
