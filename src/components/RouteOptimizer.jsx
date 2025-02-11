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
const LIBRARIES = ["places"]; // Evităm reîncărcarea LoadScript

export default function RouteOptimizer() {
  const [points, setPoints] = useState([]);
  const [start, setStart] = useState(
    "Strada Industriilor 191, 077041 Chiajna, Romania"
  );
  const [end, setEnd] = useState("Strada Nițu Vasile 68, București 041548");
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(null);

  const startRef = useRef(null);
  const endRef = useRef(null);
  const autocompleteRefs = useRef([]);

  const handlePlaceSelect = (index) => {
    if (autocompleteRefs.current[index]) {
      const place = autocompleteRefs.current[index].getPlace();
      if (!place || !place.formatted_address) return;

      const newPoints = [...points];
      newPoints[index].address = place.formatted_address;
      setPoints(newPoints);
    }
  };

  const addPoint = () => {
    setPoints([...points, { address: "", priority: 0, pauseTime: 10 }]);
  };

  const removePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const fetchOptimizedRoute = async () => {
    try {
      console.log("📤 Trimit cerere la backend:", { points, start, end });

      // Filtrăm doar punctele valide (eliminăm adresele goale)
      const validPoints = points.filter((point) => point.address.trim() !== "");

      // Construim payload-ul JSON pentru request
      const requestBody = {
        start,
        end,
      };

      // Adăugăm `points` DOAR dacă există puncte intermediare
      if (validPoints.length > 0) {
        requestBody.points = validPoints;
      }

      console.log("📤 Cerere finală către backend:", requestBody);

      const response = await axios.post(
        `${API_URL}/optimize-route`,
        requestBody
      );

      console.log("✅ Răspuns primit de la backend:", response.data);

      if (
        !response.data ||
        !response.data.routes ||
        response.data.routes.length === 0
      ) {
        console.error("🚨 Răspuns invalid de la backend:", response.data);
        return;
      }

      console.log("🔍 Adresele trimise către Google Directions API:", {
        origin: start,
        destination: end,
        waypoints:
          validPoints.length > 0
            ? validPoints.map((point) => point.address)
            : "N/A",
      });

      const directionsService = new google.maps.DirectionsService();

      // Creăm cererea pentru Google API
      const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      // Adăugăm waypoints DOAR dacă există puncte intermediare
      if (validPoints.length > 0) {
        request.waypoints = validPoints.map((point) => ({
          location: point.address,
          stopover: true,
        }));
        request.optimizeWaypoints = true;
      }

      console.log("📤 Trimit cerere către Google Directions Service:", request);

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("❌ Eroare la generarea traseului:", status);
          alert(`Google Maps nu a putut genera ruta. Eroare: ${status}`);
        }
      });

      if (response.data.routes.length > 0) {
        let totalEta = response.data.routes[0].legs.reduce(
          (sum, leg) => sum + leg.duration.value,
          0
        );
        setEta(`${Math.floor(totalEta / 60)} min`);
      }
    } catch (error) {
      console.error("❌ Eroare la obținerea rutei:", error);
    }
  };

  return (
    <div>
      <h1>Optimizare Rute</h1>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
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

        {points.map((point, index) => (
          <div key={index}>
            <Autocomplete
              onLoad={(ref) => (autocompleteRefs.current[index] = ref)}
              onPlaceChanged={() => handlePlaceSelect(index)}
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
              value={point.priority}
              onChange={(e) => {
                let newPoints = [...points];
                newPoints[index].priority = parseInt(e.target.value);
                setPoints(newPoints);
              }}
              placeholder="Prioritate"
            />

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

            <button onClick={() => removePoint(index)}>🗑️ Șterge</button>
          </div>
        ))}

        <button onClick={addPoint}>➕ Adaugă Punct Intermediar</button>

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

        <button onClick={fetchOptimizedRoute}>Optimizează Ruta</button>
        {eta && <p>ETA estimat: {eta}</p>}

        <GoogleMap
          center={{ lat: 44.4268, lng: 26.1025 }}
          zoom={12}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          {directions && directions.routes && directions.routes.length > 0 && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                preserveViewport: true,
                draggable: true,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
