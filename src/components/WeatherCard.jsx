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
    const baseUrl = import.meta.env.VITE_OPENWEATHER_BASE_URL;
    const params = new URLSearchParams({
      appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
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

  // 计算天气主题
  let theme = null;
  if (weatherData) {
    const weatherMain = weatherData.weather[0].main;
    const isNight = weatherData.weather[0].icon.endsWith('n');
    theme = getWeatherTheme(weatherMain, isNight);
  }

  return (
    <div className={`weather-card rounded-xl shadow-lg p-6 mt-6 mb-4 transition-all duration-500 bg-gradient-to-br ${theme ? theme.gradient : 'from-sky-100 to-blue-200'} bg-opacity-${theme ? theme.opacity : '80'} ${theme ? theme.textColor : 'text-sky-900'}`}> 
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
              <h2 className={`text-2xl font-bold ${theme ? theme.accentColor : 'text-sky-600 dark:text-sky-300'}`}> 
                {weatherData.name}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => onToggleFavorite({
                  name: weatherData.name,
                  temp: weatherData.main.temp,
                  description: weatherData.weather[0].description,
                  icon: weatherData.weather[0].icon,
                  timestamp: Date.now()
                })}
                className={`p-1 rounded-full transition ${isFavorite ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
                title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
                style={{marginBottom: 2}}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`h-6 w-6 transition-all duration-200 ${isFavorite ? 'text-white' : 'text-white/70 hover:text-white'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <span className={`text-sm ${theme ? theme.accentColor : 'text-text-secondary'}`}> {/* 日期字体色 */}
                {getCurrentDate()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* 天气图标和主要信息 */}
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="w-20 h-20"
              />
              <div>                <div className={`text-4xl font-bold ${theme ? theme.accentColor : 'text-sky-600 dark:text-sky-300'}`}>
                  {Math.round(weatherData.main.temp)}°
                </div>
                <div className={`capitalize ${theme ? theme.accentColor : 'text-text-secondary'}`}> 
                  {weatherData.weather[0].description}
                </div>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {/* 湿度 */}
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${theme ? 'bg-white/30' : 'bg-blue-500/10 dark:bg-blue-500/20'}`}> {/* 图标底色更亮 */}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme ? 'text-white drop-shadow' : 'text-blue-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c4.97 0 9-3.657 9-8.167C21 7.654 12 2 12 2S3 7.654 3 13.833C3 18.343 7.03 22 12 22z" />
                  </svg>
                </div>
                <span className={`text-lg font-medium text-text-primary ${theme ? theme.accentColor : 'text-text-secondary'}`}>{weatherData.main.humidity}%</span>
              </div>

              {/* 风速 */}
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${theme ? 'bg-white/30' : 'bg-cyan-500/10 dark:bg-cyan-500/20'}`}> {/* 图标底色更亮 */}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme ? 'text-white drop-shadow' : 'text-cyan-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                  </svg>
                </div>
                <span className={`text-lg font-medium text-text-primary ${theme ? theme.accentColor : 'text-text-secondary'}`}>
                  {Math.round(weatherData.wind.speed)}<span className={`text-sm ml-1 ${theme ? theme.accentColor : 'text-text-secondary'}`}>m/s</span>
                </span>
              </div>

              {/* 气压 */}
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${theme ? 'bg-white/30' : 'bg-violet-500/10 dark:bg-violet-500/20'}`}> {/* 图标底色更亮 */}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme ? 'text-white drop-shadow' : 'text-violet-500'}`} viewBox="0 0 24 24">
                    <mask id="pointer">
                      <rect x="0" y="0" width="24" height="24" fill="white" />
                      <path d="M12 12L15 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                    </mask>
                    <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none"/>
                    <circle cx="12" cy="12" r="6" stroke="none" fill="currentColor" mask="url(#pointer)"/>
                  </svg>
                </div>
                <div className={`text-lg font-medium text-text-primary ${theme ? theme.accentColor : 'text-text-secondary'}`}>
                  {Math.round(weatherData.main.pressure)}
                  <span className={`text-sm ml-1 ${theme ? theme.accentColor : 'text-text-secondary'}`}>hPa</span>
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