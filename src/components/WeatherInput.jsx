import { useState, useEffect, useRef } from "react";
import { pinyin } from "pinyin-pro";
import { useTranslation } from 'react-i18next';

// 特殊城市中文到英文名映射
const SPECIAL_CITY_MAP = {
  '哈尔滨': 'harbin',
  '喀什': 'kashgar', 
  '鄂尔多斯': 'ordos',
  '乌鲁木齐': 'urumqi',
  '呼和浩特': 'hohhot',
  '拉萨': 'lhasa',
  '齐齐哈尔': 'qiqihar',
  '台北': 'taipei',
  '高雄': 'kaohsiung',
  '基隆': 'keelung',
  '台中': 'taichung',
  '花莲': 'hualien',
  '台南': 'tainan',
  '嘉义': 'chiayi',
  '香港': 'hongkong',
  '澳门': 'macau'
};

function WeatherInput({ onSearch, searchHistory, onClearHistory }) {
  const [city, setCity] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const { t } = useTranslation();

  // 键盘导航相关
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // 监听键盘事件
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (!searchHistory.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex(idx => (idx + 1) % searchHistory.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(idx => (idx - 1 + searchHistory.length) % searchHistory.length);
      } else if (e.key === 'Enter') {
        if (highlightIndex >= 0 && highlightIndex < searchHistory.length) {
          handleHistoryClick(searchHistory[highlightIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchHistory, highlightIndex]);

  // 打开下拉时重置高亮
  useEffect(() => {
    if (isOpen) setHighlightIndex(-1);
  }, [isOpen, searchHistory]);

  // 处理点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理历史记录滚动到高亮项
  useEffect(() => {
    if (!isOpen || highlightIndex < 0) return;
    const list = listRef.current;
    if (!list) return;
    const item = list.children[highlightIndex];
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [highlightIndex, isOpen]);

  // 处理输入框变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
  };

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      const cityName = city.trim();
      
      // 先检查是否是特殊城市
      let searchTerm = SPECIAL_CITY_MAP[cityName];
      
      // 如果不是特殊城市，则使用拼音转换
      if (!searchTerm) {
        searchTerm = pinyin(cityName, {
          toneType: 'none',
          type: 'array'
        }).join('');
      }
      
      onSearch(searchTerm);
      setIsOpen(false);
    }
  };

  // 处理历史记录点击
  const handleHistoryClick = (item) => {
    setCity(item);
    onSearch(item);
    setIsOpen(false);
  };

  // 处理清除历史记录
  const handleClearHistory = (e) => {
    e.stopPropagation();
    onClearHistory();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleInputChange}
            onClick={() => setIsOpen(true)}
            placeholder={t('search_placeholder')}
            className="input pr-24"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                title={t('search_history')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="btn-icon !p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* 历史记录下拉框 */}
      {isOpen && searchHistory.length > 0 && (
        <div ref={dropdownRef} className="dropdown">
          <div className="dropdown-header">
            <span className="dropdown-header-title">
              {t('search_history')}
            </span>
            <button
              onClick={handleClearHistory}
              className="dropdown-header-action"
            >
              {t('clear_history')}
            </button>
          </div>
          <div className="dropdown-list hide-scrollbar" ref={listRef}>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                className={`dropdown-item${highlightIndex === index ? ' bg-sky-100 dark:bg-sky-700' : ''}`}
                onClick={() => handleHistoryClick(item)}
                tabIndex={-1}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="dropdown-item-icon" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span className="dropdown-item-text">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherInput;
