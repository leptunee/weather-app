import { useState } from "react";
import { useTranslation } from 'react-i18next';
import WeatherInput from "./components/WeatherInput";
import WeatherCard from "./components/WeatherCard";
import LanguageToggle from "./components/LanguageToggle";
import LocationWeather from "./components/LocationWeather";
import FavoritesList from "./components/FavoritesList";
import { useWeatherHistory } from './hooks/useWeatherHistory';
import { useFavorites } from './hooks/useFavorites';
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState(null);
  const { history, addToHistory, clearHistory } = useWeatherHistory();
  const { favorites, addFavorite, removeFavorite, updateFavorite, reorderFavorites } = useFavorites();
  const { t } = useTranslation();

  const handleSearch = (input) => {
    setCity(input);
    setCoords(null);
    addToHistory(input);
  };

  const handleLocationWeather = (latitude, longitude) => {
    setCity("");
    setCoords({ latitude, longitude });
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <div className="min-h-screen relative bg-bg-primary dark:bg-bg-secondary">
      <div className="fixed top-4 right-4 flex items-center gap-3 z-10">
        <LocationWeather onLocationWeather={handleLocationWeather} />
        <DarkModeToggle />
        <LanguageToggle />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-center gradient-text mb-6">
            {t('app_title')}
          </h1>
          <WeatherInput 
            onSearch={handleSearch} 
            searchHistory={history}
            onClearHistory={handleClearHistory}
          />
          <FavoritesList 
            favorites={favorites}
            onSelect={handleSearch}
            onRemove={removeFavorite}
            onReorder={reorderFavorites}
          />
          {(city || coords) && (
            <WeatherCard 
              city={city} 
              coords={coords}
              favorites={favorites}
              onToggleFavorite={(cityData) => {
                const isFavorite = favorites.some(f => f.name === cityData.name);
                if (isFavorite) {
                  removeFavorite(cityData.name);
                } else {
                  addFavorite(cityData);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
