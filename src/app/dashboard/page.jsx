"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RouteOptimizer from "../../components/RouteOptimizer";

export default function Dashboard() {
  const [user, setUser] = useState(null); // Creează o stare locală pentru a gestiona datele utilizatorului conectat.
  const router = useRouter(); // Inițializează hook-ul useRouter pentru navigare.

  // Folosește useEffect pentru a verifica autentificarea utilizatorului la montarea componentei.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/protected-route`, // Face o cerere GET către ruta protejată a API-ului.
          { withCredentials: true } // Trimite și cookie-urile pentru autentificare.
        );
        setUser(response.data.user); // Stochează datele utilizatorului în stare.
      } catch {
        toast.error("Acces interzis!");
        router.push("/auth/login"); // Redirecționează utilizatorul către pagina de login.
      }
    };

    fetchUser(); // Apelează funcția pentru a obține datele utilizatorului.
  }, []); // useEffect se execută o singură dată, la montarea componentei.

  // Funcția de deconectare a utilizatorului.
  const handleLogout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`, // Face o cerere POST către ruta de logout a API-ului.
      {},
      { withCredentials: true } // Trimite cookie-urile pentru a invalida sesiunea utilizatorului.
    );
    router.push("/auth/login"); // Redirecționează utilizatorul către pagina de login după deconectare.
  };

  return user ? ( // Dacă datele utilizatorului sunt disponibile, afișează dashboard-ul.
    <div>
      <h1>Bun venit, {user.name}!</h1> {/* Afișează numele utilizatorului */}
      <button onClick={handleLogout}>Deconectare</button>
      <RouteOptimizer />
    </div>
  ) : (
    <p>Se încarcă...</p>
  );
}
