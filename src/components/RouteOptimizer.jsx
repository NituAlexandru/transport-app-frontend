"use client";

import { useState, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

export default function RouteOptimizer() {
  const [points, setPoints] = useState([]);
  const [start, setStart] = useState(
    "Strada Industriilor 191, 077041 Chiajna, Romania"
  );
  const [end, setEnd] = useState(
    "Strada Industriilor 191, 077041 Chiajna, Romania"
  );
  const [directions, setDirections] = useState(null);
  const [etaNoTraffic, setEtaNoTraffic] = useState("");
  const [etaWithTraffic, setEtaWithTraffic] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const startRef = useRef(null);
  const endRef = useRef(null);
  const autocompleteRefs = useRef([]);

  // ✅ Funcție pentru conversia duratei în format corect HH:mm
  const parseDuration = (durationString) => {
    if (!durationString) return "N/A";

    const regex = /(\d+)\s*(h|ore|min)/g;
    let totalMinutes = 0;
    let match;

    while ((match = regex.exec(durationString)) !== null) {
      if (match[2] === "h" || match[2] === "ore") {
        totalMinutes += parseInt(match[1]) * 60;
      } else if (match[2] === "min") {
        totalMinutes += parseInt(match[1]);
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const fetchOptimizedRoute = async () => {
    try {
      console.log("📤 Trimit cerere la backend pentru optimizare...");

      const validPoints = points.filter((point) => point.address.trim() !== "");

      const response = await axios.post(`${API_URL}/optimize-route`, {
        start,
        end,
        departureTime,
        points: validPoints.length > 0 ? validPoints : [],
      });

      console.log("✅ Răspuns primit de la backend:", response.data);

      if (response.data.eta_no_traffic) {
        setEtaNoTraffic(parseDuration(response.data.eta_no_traffic));
        setEtaWithTraffic(parseDuration(response.data.eta_with_traffic));
        setTotalDistance(response.data.distance_total);
      }

      const orderedWaypoints = response.data.orderedPoints.map((address) => ({
        location: address,
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints: orderedWaypoints,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            console.log("📍 Harta actualizată cu traseul optimizat.");
          } else {
            console.error("❌ Eroare la generarea traseului:", status);
          }
        }
      );
    } catch (error) {
      console.error("❌ Eroare la obținerea rutei:", error);
    }
  };

  return (
    <div>
      <h1>Optimizare Rute</h1>

      <div>
        <label>
          <strong>Ora de plecare:</strong>
        </label>
        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
        <div>
          <label>
            <strong>Punct de Plecare:</strong>
          </label>
          <Autocomplete
            onLoad={(ref) => (startRef.current = ref)}
            onPlaceChanged={() =>
              setStart(startRef.current?.getPlace()?.formatted_address)
            }
          >
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Punct de plecare"
            />
          </Autocomplete>
        </div>

        {points.length > 0 && <h3>Puncte intermediare</h3>}
        {points.map((point, index) => (
          <div key={index}>
            <Autocomplete
              onLoad={(ref) => (autocompleteRefs.current[index] = ref)}
              onPlaceChanged={() => {
                const place = autocompleteRefs.current[index].getPlace();
                if (place && place.formatted_address) {
                  let newPoints = [...points];
                  newPoints[index].address = place.formatted_address;
                  setPoints(newPoints);
                }
              }}
            >
              <input
                type="text"
                value={point.address}
                onChange={(e) => {
                  let newPoints = [...points];
                  newPoints[index].address = e.target.value;
                  setPoints(newPoints);
                }}
                placeholder="Adresă intermediară"
              />
            </Autocomplete>

            <input
              type="number"
              value={point.pauseTime}
              onChange={(e) => {
                let newPoints = [...points];
                newPoints[index].pauseTime = parseInt(e.target.value);
                setPoints(newPoints);
              }}
              placeholder="Timp pauză (min)"
            />

            <button
              onClick={() => setPoints(points.filter((_, i) => i !== index))}
            >
              🗑️ Șterge
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setPoints([...points, { address: "", priority: 0, pauseTime: 10 }])
          }
        >
          ➕ Adaugă Punct Intermediar
        </button>

        <div>
          <label>
            <strong>Destinație Finală:</strong>
          </label>
          <Autocomplete
            onLoad={(ref) => (endRef.current = ref)}
            onPlaceChanged={() =>
              setEnd(endRef.current?.getPlace()?.formatted_address)
            }
          >
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Destinație finală"
            />
          </Autocomplete>
        </div>

        <button onClick={fetchOptimizedRoute}>Optimizează Ruta</button>

        {etaNoTraffic && (
          <div>
            <p>
              <strong>⏳ETA:</strong> {etaNoTraffic}
            </p>
            <p>
              <strong>🚦ETA cu trafic:</strong> {etaWithTraffic}
            </p>
            <p>
              <strong>🏁Distanța totală:</strong> {totalDistance}
            </p>
          </div>
        )}

        <GoogleMap
          center={{ lat: 44.4268, lng: 26.1025 }}
          zoom={12}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
