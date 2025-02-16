"use client";

import { Autocomplete } from "@react-google-maps/api";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Stilurile implicite pentru datepicker
import { useRef } from "react";
import styles from "./RouteForm.module.css";

// Componentă reutilizabilă pentru câmpurile cu autocomplete
function AutoCompleteInput({ value, onChange, placeholder }) {
  const autoRef = useRef(null);
  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        autoRef.current = autocomplete;
      }}
      onPlaceChanged={() => {
        if (autoRef.current) {
          const place = autoRef.current.getPlace();
          onChange(place?.formatted_address || value);
        }
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${styles.input} ${styles.inputCustom}`}
      />
    </Autocomplete>
  );
}

export default function RouteForm({
  start,
  setStart,
  end,
  setEnd,
  points,
  setPoints,
  departureTime,
  setDepartureTime,
  fetchOptimizedRoute,
}) {
  return (
    <div className={styles.formContainer}>
      {/* Selectorul de dată/oră */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <strong>Data/Ora de plecare:</strong>
        </label>
        <ReactDatePicker
          selected={departureTime ? new Date(departureTime) : null}
          onChange={(date) => setDepartureTime(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Selectează ora de plecare"
          className={`${styles.input} ${styles.dateTimeInput}`}
        />
      </div>

      {/* Punctul de plecare */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <strong>Punct de Plecare:</strong>
        </label>
        <AutoCompleteInput
          value={start}
          onChange={setStart}
          placeholder="Punct de plecare"
        />
      </div>

      {/* Puncte intermediare */}
      {points.map((point, index) => (
        <div key={index} className={styles.pointGroup}>
          {/* Rândul cu adresa și butonul de ștergere */}
          <div className={styles.addressRow}>
            <AutoCompleteInput
              value={point.address}
              onChange={(newAddress) => {
                let newPoints = [...points];
                newPoints[index].address = newAddress;
                setPoints(newPoints);
              }}
              placeholder="Adresă intermediară"
            />
            <button
              onClick={() => setPoints(points.filter((_, i) => i !== index))}
              className={styles.deleteButton}
            >
              X
            </button>
          </div>
          {/* Rândul cu label-ul și inputul pentru timpul de descarcare */}
          <div className={styles.pauseRow}>
            <label className={styles.pauseLabel}>
              <strong>Timp descarcare (min):</strong>
            </label>
            <input
              type="number"
              value={point.pauseTime}
              onChange={(e) => {
                let newPoints = [...points];
                newPoints[index].pauseTime = parseInt(e.target.value);
                setPoints(newPoints);
              }}
              placeholder="min"
              className={styles.pauseInput}
            />
          </div>
        </div>
      ))}

      {/* Buton pentru adăugarea unui nou punct intermediar */}
      <button
        onClick={() => setPoints([...points, { address: "", pauseTime: 10 }])}
        className={styles.addButton}
      >
        ➕ Adaugă Punct Intermediar
      </button>

      {/* Destinația finală */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <strong>Destinație Finală:</strong>
        </label>
        <AutoCompleteInput
          value={end}
          onChange={setEnd}
          placeholder="Destinație finală"
        />
      </div>

      {/* Butonul de submit */}
      <button onClick={fetchOptimizedRoute} className={styles.submitButton}>
        Optimizează Ruta
      </button>
    </div>
  );
}
