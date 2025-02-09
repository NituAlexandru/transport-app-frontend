import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (userData) => {
  try {
    // Face o cerere POST către backend pentru autentificare
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data; // Returnează datele primite (ex: token-ul JWT)
  } catch (error) {
    console.error("Eroare la login:", error); // Afișează eroarea în consolă pentru debugging
    throw error; // Aruncă eroarea pentru a fi tratată în frontend
  }
};

export const register = async (userData) => {
  try {
    // Face o cerere POST către backend pentru înregistrare
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Returnează datele primite
  } catch (error) {
    console.error("Eroare la înregistrare:", error); // Afișează eroarea în consolă
    throw error; // Aruncă eroarea pentru a fi tratată în frontend
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token"); // Dacă token-ul nu există, aruncă o eroare

  try {
    // Face o cerere GET către `/protected-route` pentru a verifica autenticitatea token-ului
    const response = await axios.get(`${API_URL}/protected-route`, {
      headers: { Authorization: `Bearer ${token}` }, // Adaugă token-ul în antetul cererii
    });
    return response.data.user; // Returnează datele utilizatorului autentificat
  } catch (error) {
    console.error("Eroare la verificarea token-ului:", error);
    throw error; // Aruncă eroarea pentru a fi tratată în frontend
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
