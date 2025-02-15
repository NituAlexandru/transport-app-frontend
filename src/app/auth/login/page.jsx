"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    setLoading(true);

    try {
      // 🔹 1. Facem login și așteptăm răspunsul
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { email: email.value, password: password.value },
        { withCredentials: true }
      );

      toast.success("Autentificare reușită!");

      // 🔹 2. Așteptăm ca browserul să trimită cookie-ul și verificăm user-ul
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
        await new Promise((res) => setTimeout(res, 200)); // Așteptăm 200ms
      }

      if (user) {
        router.push("/dashboard"); // 🔥 Navigăm doar când avem un user valid
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
    <form onSubmit={handleLogin}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Parola" required />
      <button type="submit" disabled={loading}>
        {loading ? "Autentificare..." : "Autentificare"}
      </button>
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/google`}>
        Autentificare cu Google
      </a>
    </form>
  );
}
