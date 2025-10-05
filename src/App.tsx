import { MapProvider } from "./components/Map/MapProvider";
import { MapContainer } from "./components/Map/MapContainer";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { MapWrapper } from "./components/Map/MapWrapper";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <MapProvider>
          <MapContainer />
        </MapProvider>
      </div>
    </div>
  );
}

export default App;
