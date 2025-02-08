import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      toast.success("Cont creat cu succes!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nume"
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Parola"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button type="submit">Înregistrează-te</button>
    </form>
  );
}
