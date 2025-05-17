import { useState, useEffect } from "react";
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
  const { t, i18n } = useTranslation();

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

  // 自动更新收藏城市的天气数据
  useEffect(() => {
    const updateFavoriteWeather = async (cityName) => {
      try {
        const baseUrl = import.meta.env.VITE_OPENWEATHER_BASE_URL;
        const params = new URLSearchParams({
          q: cityName,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
          units: 'metric',
          lang: i18n.language === 'zh' ? 'zh_cn' : 'en'
        });

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        if (!response.ok) return;
        
        const data = await response.json();
        updateFavorite(cityName, {
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`Failed to update weather for ${cityName}:`, error);
      }
    };

    // 每5分钟更新一次收藏城市的天气
    const updateAllFavorites = () => {
      favorites.forEach(city => updateFavoriteWeather(city.name));
    };

    // 初始更新
    updateAllFavorites();

    // 设置定时更新
    const intervalId = setInterval(updateAllFavorites, 300000);
    return () => clearInterval(intervalId);
  }, [favorites.length, i18n.language, updateFavorite]);

  return (
    <div className="min-h-screen relative bg-bg-primary dark:bg-bg-secondary">
      <div className="flex justify-end p-4">
        <div className="flex items-center gap-3">
          <LocationWeather onLocationWeather={handleLocationWeather} />
          <DarkModeToggle />
          <LanguageToggle />
        </div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card w-full max-w-md">          <h1 className="text-2xl font-bold text-center text-sky-600 dark:text-sky-300 mb-6">
            {t('app_title')}
          </h1>
          <WeatherInput 
            onSearch={handleSearch} 
            searchHistory={history}
            onClearHistory={handleClearHistory}
          />
          <div className="h-2 sm:h-3" /> {/* 增加输入框和收藏列表间距 */}
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
