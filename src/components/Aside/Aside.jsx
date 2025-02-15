"use client";

import Link from "next/link";

export default function Aside() {
  return (
    <aside style={asideStyle}>
      <nav>
        <ul style={ulStyle}>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/clienti">Clienti</Link>
          </li>
          <li>
            <Link href="/produse">Produse</Link>
          </li>
          <li>
            <Link href="/comenzi">Comenzi</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// Stiluri inline minimale (pentru demo).
// Poți folosi module CSS sau Tailwind pentru a le adapta după preferințe.
const asideStyle = {
  background: "#f5f5f5",
  width: "220px",
  padding: "1rem",
  borderRight: "1px solid #ccc",
  minHeight: "100vh",
};

const ulStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};
