"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../../utils/token";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [userData, setUserData] = useState(null); // Stare locală pentru a reține datele utilizatorului autentificat.
  const router = useRouter(); // Instanță a router-ului Next.js pentru redirecționare.

  // Funcție asincronă pentru obținerea datelor utilizatorului
  const fetchData = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Token lipsă!");
      router.push("/auth/login"); // Redirecționează utilizatorul către pagina de login
      return;
    }

    try {
      // Efectuează o cerere GET către ruta protejată a API-ului
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/protected-route`,
        { headers: { Authorization: `Bearer ${token}` } } // Trimite token-ul în antetul HTTP pentru autentificare
      );
      console.log("Response from API:", response.data);
      setUserData(response.data.user); // Salvează datele utilizatorului în starea locală
    } catch (error) {
      toast.error("Acces interzis!");
      router.push("/auth/login"); // Redirecționează utilizatorul către login dacă accesul este refuzat
    }
  };

  // useEffect rulează fetchData la prima randare a componentului
  useEffect(() => {
    fetchData();
  }, []); // Lista de dependențe este goală ([]), deci fetchData se execută doar o dată, la montarea componentei.

  return userData ? (
    <div>
      <h1>Bun venit, {userData.name}!</h1>
      <button onClick={() => removeToken()}>Deconectare</button>
    </div>
  ) : (
    <p>Se încarcă...</p> // Afișează un mesaj de încărcare până când datele utilizatorului sunt disponibile.
  );
}
