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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // 添加选中项索引状态
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { t } = useTranslation();

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // 防止光标移动
        setSelectedIndex(prevIndex => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault(); // 防止光标移动
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // 处理输入框点击
  const handleInputClick = () => {
    setSuggestions(searchHistory);
    setShowSuggestions(true);
    setSelectedIndex(-1); // 重置选中项
  };

  // 点击建议项时的处理
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  // 处理输入框变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setSelectedIndex(-1); // 重置选中项
    
    if (!value.trim()) {
      // 当输入框为空时，显示所有历史记录
      setSuggestions(searchHistory);
      setShowSuggestions(true);
      return;
    }

    // 过滤历史记录中匹配的项
    const matches = searchHistory.filter(item => 
      item.toLowerCase().includes(value.toLowerCase()) ||
      pinyin(item, { toneType: 'none' }).toLowerCase().includes(value.toLowerCase())
    );
    
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  // 处理点击外部关闭建议框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
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
      setCity("");
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            placeholder={t('search_placeholder')}
            className="w-full px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white"
          />
          
          {/* 搜索建议下拉框 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('search_history')}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onClearHistory();
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('clear_history')}
                </button>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 cursor-pointer text-left text-gray-800 dark:text-white
                    ${index === selectedIndex ? 
                      'bg-gray-100 dark:bg-gray-700' : 
                      'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          {t('search_button')}
        </button>
      </div>
    </form>
  );
}

export default WeatherInput;
