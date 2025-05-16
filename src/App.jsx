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
    <div className="min-h-screen relative bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4 flex items-center gap-3">
        <LocationWeather onLocationWeather={handleLocationWeather} />
        <DarkModeToggle />
        <LanguageToggle />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
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
