"use client";

import { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

export default function MapComponent({ directions }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verificăm dacă API-ul Google Maps este disponibil
    if (typeof window !== "undefined" && window.google) {
      setIsLoaded(true);
    } else {
      // Dacă nu e încă disponibil, setăm un interval de verificare
      const interval = setInterval(() => {
        if (window.google) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  if (!isLoaded) {
    return <p>Se încarcă harta...</p>;
  }

  return (
    <GoogleMap
      center={{ lat: 44.4268, lng: 26.1025 }}
      zoom={11}
      mapContainerStyle={{ height: "500px", width: "100%" }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}
