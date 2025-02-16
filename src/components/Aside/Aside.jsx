"use client";

import Link from "next/link";
import styles from "./Aside.module.css";

export default function Aside() {
  return (
    <aside className={styles.asideContainer}>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/clienti" className={styles.navLink}>
              Clienti
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/produse" className={styles.navLink}>
              Produse
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/comenzi" className={styles.navLink}>
              Comenzi
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/rute" className={styles.navLink}>
              Optimizeaza Rute
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
