import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const FavoritesList = ({ favorites, onSelect, onRemove, onReorder }) => {
  const { t, i18n } = useTranslation();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // 收藏列表组件的核心拖拽功能

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = favorites.findIndex((item) => item.name === active.id);
      const newIndex = favorites.findIndex((item) => item.name === over.id);
      onReorder?.(oldIndex, newIndex);
    }
  };

  if (!favorites.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        {t('favorites_list')}
      </h2>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={favorites.map(city => city.name)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {favorites.map(city => (
              <SortableItem
                key={city.name}
                id={city.name}
                city={city}
                onSelect={onSelect}
                onRemove={onRemove}
                t={t}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default FavoritesList;
