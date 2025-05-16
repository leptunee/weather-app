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
                 disabled:text-blue-400 dark:disabled:text-blue-600 disabled:cursor-not-allowed
                 shadow-lg hover:shadow-xl active:scale-95
                 border border-blue-100 dark:border-blue-900"
        title={isRequesting ? t('location.requesting') : t('location.button')}
      >
        <div className={`relative ${isRequesting ? 'animate-spin' : 'group-hover:animate-bounce'}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 stroke-current"
          >
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {isRequesting && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-ping"></div>
          )}
        </div>
      </button>

      {error && (
        <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-red-50 dark:bg-red-900/90 backdrop-blur 
                      rounded-lg border border-red-200 dark:border-red-800 shadow-lg animate-fade-in z-50">
          <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-xs">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationWeather;
