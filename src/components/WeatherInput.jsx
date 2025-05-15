import { useState, useEffect, useRef } from "react";
import { pinyin } from "pinyin-pro";

function WeatherInput({ onSearch, searchHistory }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // 添加选中项索引状态
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

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
      // 将输入的中文转换为拼音（不带声调）
      const cityPinyin = pinyin(city.trim(), {
        toneType: 'none',
        type: 'array'
      }).join('');
      
      onSearch(cityPinyin);
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
            placeholder="请输入城市名（支持中文）"
            className="w-full px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white"
          />
          
          {/* 搜索建议下拉框 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">搜索历史</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearHistory();
                    setShowSuggestions(false);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  清除历史记录
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
          查询
        </button>
      </div>
    </form>
  );
}

export default WeatherInput;
