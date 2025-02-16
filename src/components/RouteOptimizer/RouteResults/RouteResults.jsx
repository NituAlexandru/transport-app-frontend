"use client";

import { useCallback } from "react";
import styles from "./RouteResults.module.css";

export default function RouteResults({ routeData }) {
  if (!routeData || Object.keys(routeData).length === 0) return null; // nu afișează nimic dacă nu sunt date

  // Funcție pentru a genera link-ul Google Maps
  const buildMapsLink = useCallback(() => {
    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    const origin = `origin=${encodeURIComponent(routeData.start)}`;
    const destination = `destination=${encodeURIComponent(routeData.end)}`;

    // Punctele intermediare, dacă există
    let waypoints = "";
    if (routeData.orderedPoints && routeData.orderedPoints.length > 0) {
      // Alăturăm adresele cu " | " (URL-encoded)
      waypoints = `&waypoints=${encodeURIComponent(
        routeData.orderedPoints.join("|")
      )}`;
    }

    return `${baseUrl}&${origin}&${destination}${waypoints}`;
  }, [routeData]);

  // Funcție care copiază link-ul în clipboard
  const handleCopy = async () => {
    const link = buildMapsLink();
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      alert("Eroare la copiere!");
    }
  };

  const mapsLink = buildMapsLink();

  return (
    <div className={styles.resultsContainer}>
      <p>
        <strong>🚦 ETA:</strong> {routeData.eta_with_traffic}
      </p>
      <p>
        <strong>📦 Timp total descărcare:</strong> {routeData.totalUnloadTime}
      </p>
      <p>
        <strong>🕒 Timp total (livrare + descărcare):</strong>{" "}
        {routeData.totalDeliveryTime}
      </p>
      <p>
        <strong>🏁 Distanța totală:</strong> {routeData.distance_total}
      </p>

      <div className={styles.shareSection}>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapsLink}
        >
          Deschide ruta în Google Maps
        </a>
        <button className={styles.copyButton} onClick={handleCopy}>
          Copiaza Link Ruta
        </button>
      </div>
    </div>
  );
}
