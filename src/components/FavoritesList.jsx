import { useTranslation } from 'react-i18next';

const FavoritesList = ({ favorites, onSelect, onRemove }) => {
  const { t } = useTranslation();

  if (!favorites.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        {t('favorites_list')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {favorites.map(city => (
          <button
            key={city.name}
            onClick={() => onSelect?.(city.name)}
            className="group relative bg-white/60 dark:bg-white/10 backdrop-blur 
                     p-3 rounded-xl border border-gray-200 dark:border-gray-700
                     hover:bg-white/80 dark:hover:bg-white/20 
                     transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {city.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(city.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                         hover:text-red-500 transition-opacity duration-200"
                title={t('remove_from_favorites')}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>            <div className="space-y-1">
              <div className="flex items-center">
                <img 
                  src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                  alt={city.description}
                  className="w-8 h-8 -ml-1"
                />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {city.temp?.toFixed(1)}°C
                </span>
              </div>
              {city.timestamp && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(city.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
