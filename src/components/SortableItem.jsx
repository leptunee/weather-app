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
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e) => {
    // 阻止按钮点击事件冒泡
    if (e.target.closest('button')) {
      return;
    }
    onSelect?.(city.name);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none h-[120px] ${isDragging ? 'z-10' : ''}`}
    >
      <div
        {...attributes}
        className={`group relative w-full h-full bg-white/60 dark:bg-white/10 backdrop-blur 
                   p-3 rounded-xl border border-gray-200 dark:border-gray-700
                   hover:bg-white/80 dark:hover:bg-white/20 
                   transition-all duration-300 flex flex-col justify-between cursor-pointer
                   ${isDragging ? 'ring-2 ring-blue-500 opacity-80' : ''}`}
        onClick={handleClick}
      >
        {/* 删除按钮 - 移到外部以避免与拖拽冲突 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(city.name);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 
                   hover:bg-gray-100 dark:hover:bg-gray-700 
                   text-gray-400 hover:text-red-500 
                   transition-all duration-200 rounded-lg z-10"
          title={t('remove_from_favorites')}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 拖拽手柄区域 */}
        <div {...listeners} className="cursor-grab active:cursor-grabbing py-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate block pr-8">
            {city.name}
          </span>
        </div>
        
        {/* 天气信息区域 */}
        <div>
          <div className="flex items-center gap-2">
            <img 
              src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt={city.description}
              className="w-10 h-10 -ml-1 weather-icon-small"
              loading="lazy"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {typeof city.temp === 'number' ? city.temp.toFixed(1) : '--'}°C
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
      </div>
    </div>
  );
}
