import React, { useEffect, useRef } from "react";
import { useMapglContext } from "./MapProvider";
import { useMapStore } from "@/store/useMapStore";
import { MarkMarker } from "./MarkMarker";
import { NewMarkForm } from "./NewMarkForm";

export const MapContainer: React.FC = () => {
  const {
    mapglInstance: map,
    mapgl,
    isLoaded: isMapLoaded,
  } = useMapglContext();
  const {
    marks,
    isAddingMark,
    newMarkPosition,
    startAddingMark,
    setCenter,
    setZoom,
  } = useMapStore();

  useEffect(() => {
    if (isMapLoaded) {
      console.info(mapgl, map, isMapLoaded);
      new mapgl.Marker(map, {
        coordinates: [55.31878, 25.23584],
      });
      // Обработка клика по карте для добавления метки
      const handleMapClick = (e: any) => {
        if (!isAddingMark) {
          const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
          startAddingMark(coordinates);
        }
      };

      // Обработка изменения центра и зума
      const handleMoveEnd = () => {
        if (map) {
          const center = map.getCenter();
          const zoom = map.getZoom();
          setCenter([center.lng, center.lat]);
          setZoom(zoom);
        }
      };

      // Обработка ошибок карты
      const handleMapError = (error: any) => {
        console.error("Ошибка карты:", error);
      };

      map.on("click", handleMapClick);
      map.on("moveend", handleMoveEnd);
      map.on("error", handleMapError);

      return () => {
        map.off("click", handleMapClick);
        map.off("moveend", handleMoveEnd);
        map.off("error", handleMapError);
      };
    }
  }, [
    map,
    mapgl,
    isMapLoaded,
    isAddingMark,
    startAddingMark,
    setCenter,
    setZoom,
  ]);

  return (
    <div className="flex-1 relative">
      <div id="map-container" className="w-full h-full" />

      {/* Отображение меток */}
      {isMapLoaded &&
        map &&
        marks.map((mark) => <MarkMarker key={mark.id} mark={mark} map={map} />)}

      {/* Форма добавления новой метки */}
      {isAddingMark && newMarkPosition && (
        <NewMarkForm
          position={newMarkPosition}
          onClose={() => useMapStore.getState().cancelAddingMark()}
        />
      )}
    </div>
  );
};
