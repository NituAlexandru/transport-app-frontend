"use client";

export default function RouteResults({ routeData }) {
  if (!routeData || Object.keys(routeData).length === 0) return null; // 🔥 Nu afișează nimic dacă nu sunt date

  return (
    <div>
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
    </div>
  );
}
