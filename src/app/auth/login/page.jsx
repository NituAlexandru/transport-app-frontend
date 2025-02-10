"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter(); // Inițializează obiectul router pentru redirecționare după autentificare.

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements; // Extrage câmpurile `email` și `password` din formular.

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`, // Folosește variabila de mediu pentru a păstra URL-ul API flexibil.
        {
          email: email.value,
          password: password.value,
        },
        { withCredentials: true } // Permite trimiterea cookie-urilor pentru autentificare.
      );

      toast.success("Autentificare reușită!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Eroare la autentificare!"); // Gestionare de erori cu fallback.
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {" "}
      <input name="email" type="email" placeholder="Email" required />{" "}
      <input name="password" type="password" placeholder="Parola" required />{" "}
      <button type="submit">Autentificare</button>
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/google`}>
        {" "}
        Autentificare cu Google
      </a>
    </form>
  );
}
