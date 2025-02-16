"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

import styles from "../auth.module.css";

import axios from "axios";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Exemplu direct cu axios
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, user, {
        withCredentials: true,
      });

      toast.success("Cont creat cu succes! Redirectare către login...");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Eroare la înregistrare");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nume</label>
            <input
              id="name"
              type="text"
              className={styles.inputField}
              placeholder="Nume"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.inputField}
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Parola</label>
            <input
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="Parola"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Înregistrează-te
          </button>
        </form>

        {/* Link către Login */}
        <div className={styles.switchSection}>
          Ai deja cont?
          <Link href="/auth/login" className={styles.switchLink}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
