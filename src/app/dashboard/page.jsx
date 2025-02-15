"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import RouteOptimizer from "../../components/RouteOptimizer/RouteOptimizer/RouteOptimizer";
import Aside from "../../components/Aside/Aside";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/protected-route`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch {
        toast.error("Acces interzis!");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Se încarcă...</p>;

  return (
    <div className={styles.layout}>
      <header className={styles.navbarWrapper}>
        <Navbar user={user} setUser={setUser} />
      </header>

      <main className={styles.contentContainer}>
        <Aside />
        <div className={styles.mainContent}>
          <RouteOptimizer />
        </div>
      </main>
    </div>
  );
}
