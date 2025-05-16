import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LocationWeather = ({ onLocationWeather }) => {
  const { t } = useTranslation();
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(t('location.not_supported'));
      return;
    }

    setIsRequesting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          onLocationWeather(position.coords.latitude, position.coords.longitude);
        } catch (err) {
          setError(t('location.error'));
        } finally {
          setIsRequesting(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(
          err.code === 1 
            ? t('location.permission_needed')
            : t('location.error')
        );
        setIsRequesting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={handleGetLocation}
        disabled={isRequesting}
        className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur
                 hover:bg-white dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full
                 transition-all duration-300 ease-in-out transform hover:scale-110
                 shadow-lg hover:shadow-xl active:scale-95
                 border border-blue-100 dark:border-blue-900
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="w-6 h-6 flex items-center justify-center group-hover:animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </button>
      {error && (
        <div className="absolute top-full mt-2 -left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm py-1 px-2 rounded shadow-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationWeather;
