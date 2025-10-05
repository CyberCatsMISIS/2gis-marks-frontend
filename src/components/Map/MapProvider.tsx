import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useMapStore } from "@/store/useMapStore";
import type { MapGL as MapGLType } from "@2gis/mapgl";
import { load } from "@2gis/mapgl";

const MapglContext = createContext<{
  mapgl?: typeof mapgl;
  mapglInstance?: mapgl.Map;
  setMapglContext: Dispatch<SetStateAction<MapContextState>>;
}>({
  mapgl: undefined,
  mapglInstance: undefined,
  setMapglContext: () => {},
});

interface MapContextState {
  mapglInstance?: mapgl.Map;
  mapgl?: typeof mapgl;
  isLoaded: boolean;
}

export const useMapglContext = () => useContext(MapglContext);

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [{ mapglInstance, mapgl }, setMapglContext] = useState<MapContextState>(
    {
      mapglInstance: undefined,
      mapgl: undefined,
    }
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_2GIS_API_KEY;
        if (!apiKey) {
          console.error("VITE_2GIS_API_KEY не найден в переменных окружения");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        const mapgl = await load();
        const map = new mapgl.Map("map-container", {
          center: [55.31878, 25.23584],
          zoom: 13,
          key: apiKey,
        });

        map.on("load", () => {
          console.log("Карта 2GIS загружена");
        });

        map.on("error", console.error);

        setMapglContext({
          mapglInstance: map,
          mapgl,
        });
        setIsLoaded(true);
      } catch (error) {
        console.error("Ошибка инициализации карты:", error);
        // const mapContainer = document.getElementById("map-container");
        // if (mapContainer) {
        //   mapContainer.innerHTML = `
        //     <div style="
        //       width: 100%;
        //       height: 100%;
        //       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        //       display: flex;
        //       align-items: center;
        //       justify-content: center;
        //       color: white;
        //       font-size: 18px;
        //       text-align: center;
        //       flex-direction: column;
        //       gap: 10px;
        //     ">
        //       <div>🗺️</div>
        //       <div>Карта 2GIS недоступна</div>
        //       <div style="font-size: 14px; opacity: 0.8;">Проверьте подключение к интернету или API ключ.</div>
        //     </div>
        //   `;
        //   setIsLoaded(false); // Карта не загружена
        // }
      }
    };

    initMap();

    return () => {
      if (mapglInstance) {
        mapglInstance.destroy();
      }
    };
  }, []);

  return (
    <MapglContext.Provider
      value={{ mapgl, mapglInstance, setMapglContext, isLoaded }}
    >
      {children}
    </MapglContext.Provider>
  );
};
