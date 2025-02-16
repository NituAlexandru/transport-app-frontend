import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useRouteOptimization() {
  const [start, setStart] = useState(
    "Strada Industriilor 191, Chiajna, Romania"
  );
  const [end, setEnd] = useState("Strada Industriilor 191, Chiajna, Romania");
  const [points, setPoints] = useState([]);
  const [departureTime, setDepartureTime] = useState("");
  const [directions, setDirections] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const parseDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) return `${hours} ore ${mins} min`;
    if (hours > 0) return `${hours} ore`;
    return `${mins} min`;
  };

  const parseEtaStringToMinutes = (etaString) => {
    if (!etaString) return 0;
    let minutes = 0;

    // Extrage orele: "1 ore" sau "1 hr"
    const hoursMatch = etaString.match(/(\d+)\s*(ore|hr)/i);
    if (hoursMatch) {
      minutes += parseInt(hoursMatch[1], 10) * 60;
    }

    // Extrage minutele: "2 min"
    const minutesMatch = etaString.match(/(\d+)\s*min/i);
    if (minutesMatch) {
      minutes += parseInt(minutesMatch[1], 10);
    }

    return minutes;
  };

  const fetchOptimizedRoute = async () => {
    try {
      if (!start || !end) {
        console.error("⚠️ Punctul de plecare și destinația trebuie setate.");
        return;
      }

      const response = await axios.post(`${API_URL}/optimize-route`, {
        start,
        end,
        departureTime,
        points,
      });

      console.log("✅ Răspuns API:", response.data);

      const etaWithTrafficStr = response.data.eta_with_traffic || "0 min";
      const etaWithTrafficMinutes = parseEtaStringToMinutes(etaWithTrafficStr);

      const totalUnloadTime = points.reduce(
        (sum, point) => sum + (point.pauseTime || 0),
        0
      );
      const totalDeliveryTime = etaWithTrafficMinutes + totalUnloadTime;

      setRouteData({
        eta_no_traffic: response.data.eta_no_traffic || "N/A",
        eta_with_traffic: response.data.eta_with_traffic || "N/A",
        distance_total: response.data.distance_total || "N/A",
        totalUnloadTime: parseDuration(totalUnloadTime),
        totalDeliveryTime: parseDuration(totalDeliveryTime),
        start,
        end,
        orderedPoints: response.data.orderedPoints || [],
      });

      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.DirectionsService
      ) {
        console.error("⚠️ Google Maps API nu este încărcat complet!");
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints:
            response.data.orderedPoints?.map((address) => ({
              location: address,
              stopover: true,
            })) || [],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("❌ Eroare la generarea traseului:", status);
          }
        }
      );
    } catch (error) {
      console.error("❌ Eroare la obținerea rutei:", error);
    }
  };

  return {
    start,
    setStart,
    end,
    setEnd,
    points,
    setPoints,
    departureTime,
    setDepartureTime,
    directions,
    fetchOptimizedRoute,
    routeData,
  };
}
