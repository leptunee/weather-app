// 天气主题配置
export const getWeatherTheme = (weatherMain, isNight) => {
  const themes = {
    Clear: {
      day: {
        gradient: 'from-sky-400 to-blue-500',
        opacity: '70',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-gray-900 to-blue-900',
        opacity: '80',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    },
    Clouds: {
      day: {
        gradient: 'from-gray-400 to-gray-500',
        opacity: '70',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-gray-800 to-gray-900',
        opacity: '80',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    },
    Rain: {
      day: {
        gradient: 'from-gray-500 to-gray-600',
        opacity: '80',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-gray-800 to-gray-900',
        opacity: '90',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    },
    Snow: {
      day: {
        gradient: 'from-gray-400 to-gray-500',
        opacity: '70',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-blue-900 to-gray-900',
        opacity: '80',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    },
    Thunderstorm: {
      day: {
        gradient: 'from-gray-600 to-gray-800',
        opacity: '90',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-gray-900 to-black',
        opacity: '95',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    },
    default: {
      day: {
        gradient: 'from-gray-400 to-gray-500',
        opacity: '70',
        textColor: 'text-white',
        accentColor: 'text-white'
      },
      night: {
        gradient: 'from-gray-800 to-gray-900',
        opacity: '80',
        textColor: 'text-white',
        accentColor: 'text-white'
      }
    }
  };

  const timeOfDay = isNight ? 'night' : 'day';
  return {
    ...themes[weatherMain]?.[timeOfDay] || themes.default[timeOfDay],
    transition: 'transition-all duration-500'
  };
};
