"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";

import styles from "../auth.module.css"; // Importăm modulul CSS din folderul părinte (../)

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { email: email.value, password: password.value },
        { withCredentials: true }
      );

      toast.success("Autentificare reușită!");

      // Verificăm user-ul prin /protected-route
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/protected-route`,
            { withCredentials: true }
          );
          return response.data.user;
        } catch {
          return null;
        }
      };

      let user = null;
      for (let i = 0; i < 5; i++) {
        user = await fetchUser();
        if (user) break;
        await new Promise((res) => setTimeout(res, 200));
      }

      if (user) {
        router.push("/dashboard");
      } else {
        toast.error("Eroare la autentificare. Reîncercați.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Eroare la autentificare!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Log In</h2>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.inputField}
              placeholder="Email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Parola</label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.inputField}
              placeholder="Parola"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Autentificare..." : "Autentificare"}
          </button>
        </form>

        {/* Buton/link pentru Google */}
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/google`}
          className={styles.link}
        >
          Autentificare cu Google
        </a>

        {/* Link către Register */}
        <div className={styles.switchSection}>
          Nu ai cont?
          <Link href="/auth/register" className={styles.switchLink}>
            Înregistrează-te
          </Link>
        </div>
      </div>
    </div>
  );
}
