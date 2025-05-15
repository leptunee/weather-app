import React, { useState, useEffect } from "react";
import { useWeatherHistory } from '../hooks/useWeatherHistory';
import { useTranslation } from 'react-i18next';

// 添加中文城市名映射
const cityNameMap = {
  'beijing': '北京',
  'shanghai': '上海',
  'guangzhou': '广州',
  'shenzhen': '深圳',
  'hangzhou': '杭州',
  'chengdu': '成都',
  'nanjing': '南京',
  'wuhan': '武汉',
  'xian': '西安',
  'tianjin': '天津',
  'chongqing': '重庆',
  'suzhou': '苏州',
  'qingdao': '青岛',
  'dalian': '大连',
  'xiamen': '厦门',
  'shenyang': '沈阳',
  'changsha': '长沙'
};

const WeatherCard = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToHistory, history } = useWeatherHistory();
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

  useEffect(() => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d9248032030562dee7f8a5c9500ae2ab&units=metric&lang=${i18n.language === 'zh' ? 'zh_cn' : 'en'}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(t('error_not_found'));
        }
        return response.json();
      })
      .then(data => {
        setWeatherData(data);
        // 在成功获取天气数据后保存城市到历史记录
        addToHistory(city);
        console.log("历史记录:", history);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

  }, [city, i18n.language, t, addToHistory]);

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

  const { name, main: { temp, humidity }, weather: [{ description, icon }], wind: { speed } } = weatherData;
  
  // 获取中文城市名，如果映射中没有则使用 API 返回的名称
  const cityNameChinese = cityNameMap[city.toLowerCase()] || name;

  return (
    <div className="bg-white/30 dark:bg-white/10 backdrop-blur p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{cityNameChinese}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getCurrentDate()}</p>
        </div>
        <div className="bg-white dark:bg-white/20 p-1 rounded-full shadow-md">
          <img 
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-14 h-14"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{temp.toFixed(1)}°C</p>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <p>{t('humidity')}：{humidity}%</p>
          <p>{t('wind_speed')}：{speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;