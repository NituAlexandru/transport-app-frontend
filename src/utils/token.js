import { useRouter } from "next/navigation";

// Salvează token-ul în localStorage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Obține token-ul din localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Șterge token-ul din localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
  const router = useRouter();
  router.push("/auth/login");
};
