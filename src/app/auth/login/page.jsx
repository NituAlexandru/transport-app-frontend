"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../services/auth";
import { saveToken } from "../../../utils/token";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" }); // Stare pentru a reține email-ul și parola introduse de utilizator

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const data = await login(user); // Apelează funcția login pentru autentificare, trimițând datele utilizatorului
      saveToken(data.token); // Salvează token-ul primit în localStorage
      toast.success("Autentificare reușită!"); // Afișează o notificare de succes
      router.push("/dashboard"); // Redirecționează utilizatorul către pagina de dashboard
    } catch (error) {
      // Afișează o notificare de eroare dacă autentificarea eșuează
      toast.error(error.response?.data?.message || "Eroare la autentificare");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Autentificare</button>
    </form>
  );
}
