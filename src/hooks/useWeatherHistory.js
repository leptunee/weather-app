import { useState, useCallback } from 'react';

const STORAGE_KEY = 'weatherHistory';
const MAX_HISTORY = 10;

export function useWeatherHistory() {
  // 初始化时从 localStorage 获取历史记录
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('读取历史记录失败:', error);
      return [];
    }
  });

  // 保存城市到历史记录
  const addToHistory = useCallback((cityName) => {
    const lowerCaseName = cityName.toLowerCase();
    
    setHistory(prevHistory => {
      // 创建新数组（不直接修改原数组）
      const newHistory = [...prevHistory];
      
      // 检查是否已存在该城市
      const index = newHistory.indexOf(lowerCaseName);
      if (index !== -1) {
        // 如果存在，先删除旧的记录
        newHistory.splice(index, 1);
      }
      
      // 添加到数组开头
      newHistory.unshift(lowerCaseName);
      
      // 只保留最近指定数量的记录
      const limitedHistory = newHistory.slice(0, MAX_HISTORY);
      
      // 保存到 localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
      
      return limitedHistory;
    });
  }, []);
  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('清空历史记录失败:', error);
    }
  }, []);

  return {
    history,
    addToHistory,
    clearHistory
  };
}
