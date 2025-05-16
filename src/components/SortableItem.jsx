import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, city, onSelect, onRemove, t }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none h-[120px]" // 添加固定高度
    >
      <button
        onClick={() => onSelect?.(city.name)}
        className={`group relative w-full h-full bg-white/60 dark:bg-white/10 backdrop-blur 
                   p-3 rounded-xl border border-gray-200 dark:border-gray-700
                   hover:bg-white/80 dark:hover:bg-white/20 
                   transition-all duration-300 flex flex-col justify-between
                   ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[80%]">
            {city.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(city.name);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 
                     hover:text-red-500 transition-opacity duration-200 shrink-0"
            title={t('remove_from_favorites')}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
    </div>
  );
}
