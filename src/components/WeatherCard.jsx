import React, { useState, useEffect, useCallback } from "react";
import { useWeatherHistory } from '../hooks/useWeatherHistory';
import { useTranslation } from 'react-i18next';
import { getWeatherTheme } from '../utils/weatherTheme';

const REFRESH_INTERVAL = 300000; // 5分钟自动刷新一次

const WeatherCard = ({ city, coords, favorites = [], onToggleFavorite }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToHistory } = useWeatherHistory();
  const { t, i18n } = useTranslation();

  // 获取当前日期
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long'
    };
    return now.toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US', options);
  };

  // 获取天气数据的函数
  const fetchWeatherData = useCallback(async () => {
    if (!city && !coords) return;
    
    setLoading(true);
    setError(null);
    
    // 构建 API URL
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const params = new URLSearchParams({
      appid: 'd9248032030562dee7f8a5c9500ae2ab',
      units: 'metric',
      lang: i18n.language === 'zh' ? 'zh_cn' : 'en'
    });

    if (city) {
      params.append('q', city);
    } else if (coords) {
      params.append('lat', coords.latitude);
      params.append('lon', coords.longitude);
    }

    const apiUrl = `${baseUrl}?${params.toString()}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(t('error_not_found'));
      }
      const data = await response.json();
      setWeatherData(data);
      if (city) {
        addToHistory(city);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [city, coords, i18n.language, t, addToHistory]);

  // 初始加载和语言变化时获取数据
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // 设置自动刷新
  useEffect(() => {
    const intervalId = setInterval(fetchWeatherData, REFRESH_INTERVAL);
    
    // 清理函数
    return () => clearInterval(intervalId);
  }, [fetchWeatherData]);

  const isFavorite = favorites?.some(f => f.name === weatherData?.name);

  return (
    <div className="weather-card">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 dark:text-red-400 py-4">
          {error}
        </div>
      ) : weatherData && (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <h2 className="text-2xl font-bold gradient-text">
                {weatherData.name}
              </h2>
              <button
                onClick={() => onToggleFavorite({
                  name: weatherData.name,
                  temp: weatherData.main.temp,
                  description: weatherData.weather[0].description,
                  icon: weatherData.weather[0].icon,
                  timestamp: Date.now()
                })}
                className="mt-1"
                title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
            <span className="text-sm text-text-secondary">
              {getCurrentDate()}
            </span>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* 天气图标和主要信息 */}
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="w-20 h-20"
              />
              <div>
                <div className="text-4xl font-bold gradient-text">
                  {Math.round(weatherData.main.temp)}°
                </div>
                <div className="text-text-secondary capitalize">
                  {weatherData.weather[0].description}
                </div>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {/* 湿度 */}
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-blue-500/10 dark:bg-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c4.97 0 9-3.657 9-8.167C21 7.654 12 2 12 2S3 7.654 3 13.833C3 18.343 7.03 22 12 22z" />
                  </svg>
                </div>                <span className="text-lg font-medium text-text-primary">{weatherData.main.humidity}%</span>
              </div>

              {/* 风速 */}
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-cyan-500/10 dark:bg-cyan-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-text-primary">
                  {Math.round(weatherData.wind.speed)}<span className="text-sm ml-1 text-text-secondary">m/s</span>
                </span>
              </div>

              {/* 气压 */}
              <div className="flex items-center gap-2">                <div className="rounded-full p-2 bg-violet-500/10 dark:bg-violet-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-500" viewBox="0 0 24 24">
                    <mask id="pointer">
                      <rect x="0" y="0" width="24" height="24" fill="white" />
                      <path d="M12 12L15 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </mask>
                    <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none"/>
                    <circle cx="12" cy="12" r="6" stroke="none" fill="currentColor" mask="url(#pointer)"/>
                  </svg>
                </div>
                <div className="text-lg font-medium leading-none text-text-primary">
                  {Math.round(weatherData.main.pressure)}
                  <span className="text-sm ml-1 text-text-secondary">hPa</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherCard;