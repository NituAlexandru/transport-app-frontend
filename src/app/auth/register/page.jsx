"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../../services/auth";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(user); // Apelează funcția register pentru a înregistra utilizatorul cu datele completate.
      toast.success("Cont creat cu succes! Redirectare către login...");
      router.push("/auth/login"); // Redirecționează utilizatorul către pagina de login după crearea contului.
    } catch (error) {
      toast.error(error.response?.data?.message || "Eroare la înregistrare");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nume"
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Parola"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        required
      />
      <button type="submit">Înregistrează-te</button>
    </form>
  );
}
