import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weatherAppFavorites';

export function useFavorites() {
  // 初始化状态
  const [favorites, setFavorites] = useState([]);

  // 在组件挂载时从 localStorage 读取收藏数据
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // 添加收藏
  const addFavorite = useCallback((city) => {
    if (!city?.name) return;

    setFavorites(prev => {
      // 检查是否已经收藏
      if (prev.some(item => item.name === city.name)) {
        return prev;
      }

      // 创建新的收藏列表
      const newFavorites = [...prev, {
        name: city.name,
        timestamp: Date.now(),
        ...city
      }];

      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }

      return newFavorites;
    });
  }, []);

  // 移除收藏
  const removeFavorite = useCallback((cityName) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(city => city.name !== cityName);
      
      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }

      return newFavorites;
    });
  }, []);

  // 更新收藏城市的数据
  const updateFavorite = useCallback((cityName, newData) => {
    setFavorites(prev => {
      const newFavorites = prev.map(city => 
        city.name === cityName 
          ? { ...city, ...newData, timestamp: Date.now() }
          : city
      );

      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }

      return newFavorites;
    });
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateFavorite
  };
}
