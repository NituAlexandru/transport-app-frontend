"use client";

import RouteForm from "../RouteForm/RouteForm";
import RouteResults from "../RouteResults/RouteResults";
import MapComponent from "../MapComponent/MapComponent";
import useRouteOptimization from "../../../hooks/useRouteOptimizer";
import styles from "./RouteOptimizer.module.css";

export default function RouteOptimizer() {
  const {
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
  } = useRouteOptimization();

  return (
    <div className={styles.optimizerContainer}>
      <h2>Optimizare Rute</h2>
      <div className={styles.rowContainer}>
        <div>
          <RouteForm
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            points={points}
            setPoints={setPoints}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            fetchOptimizedRoute={fetchOptimizedRoute}
          />

          <RouteResults routeData={routeData} />
        </div>
        <MapComponent directions={directions} />
      </div>
    </div>
  );
}
