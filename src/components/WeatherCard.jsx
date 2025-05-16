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

  if (loading) {
    return (
      <div className="animate-pulse bg-white/30 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow-lg">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <p className="text-center text-gray-600 dark:text-gray-400">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 backdrop-blur p-6 rounded-xl shadow-lg">
        <p className="text-red-600 dark:text-red-400">{t('error_not_found')}</p>
      </div>
    );
  }
  if (!weatherData) return null;
  const { 
    name, 
    main: { temp, humidity }, 
    weather: [{ description, icon, main: weatherMain }], 
    wind: { speed },
    sys: { sunrise, sunset }
  } = weatherData;
  
  // 判断当前是否是夜间
  const isNight = () => {
    const currentTime = Math.floor(Date.now() / 1000); // 转换为 Unix 时间戳（秒）
    return currentTime < sunrise || currentTime > sunset;
  };
  
  // 获取城市显示名称
  const getCityDisplayName = (cityName) => {
    if (!cityName) return name;
    const lowercaseCity = cityName.toLowerCase();
    const translatedName = t(`cities.${lowercaseCity}`, { defaultValue: '' });
    return translatedName || name;
  };

  // 检查是否已收藏
  const isFavorite = favorites?.some(f => f.name === name);

  const cityDisplayName = getCityDisplayName(city);
  const nightModeClass = isNight() 
    ? 'bg-gray-900/40 text-gray-100' 
    : 'bg-white/30 dark:bg-white/10 text-gray-800 dark:text-white';
  const theme = getWeatherTheme(weatherMain, isNight());
  return (    <div className={`relative overflow-hidden backdrop-blur p-6 rounded-xl shadow-lg ${theme.transition}`}>
      {/* 动态渐变背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-${theme.opacity} ${theme.transition}`}></div>
      
      {/* 内容区域 */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-2">          
            <div>
              <h2 className={`text-xl font-semibold ${theme.textColor} ${theme.transition}`}>
                {cityDisplayName}
              </h2>
              <p className={`text-sm mt-1 ${theme.accentColor} ${theme.transition}`}>
                {getCurrentDate()}
              </p>
            </div>
            <button
              onClick={() => onToggleFavorite?.({
                name,
                temp,
                humidity,
                description,
                icon,
                speed,
                timestamp: Date.now()
              })}
              className={`p-1.5 rounded-full transition-all duration-300 transform 
                         hover:scale-110 active:scale-95
                         ${isFavorite 
                           ? 'text-yellow-500 hover:text-yellow-600 animate-bounce-once' 
                           : 'text-gray-400 hover:text-yellow-500 hover:animate-pulse'}`}
              title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor" 
                className="w-6 h-6"
                strokeWidth={isFavorite ? "0" : "2"}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          </div>          <div className={`bg-white/20 p-1 rounded-full shadow-md backdrop-blur ${theme.transition}`}>
            <img 
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-14 h-14"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className={`text-3xl font-bold ${theme.textColor} ${theme.transition}`}>
            {temp.toFixed(1)}°C
          </p>
          <p className={`${theme.accentColor} ${theme.transition}`}>
            {description}
          </p>
          <div className={`grid grid-cols-2 gap-2 text-sm ${theme.accentColor} ${theme.transition}`}>
            <p>{t('humidity')}: {humidity}%</p>
            <p>{t('wind_speed')}: {speed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;