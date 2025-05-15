import { useState, useEffect, useRef } from "react";
import { pinyin } from "pinyin-pro";

function WeatherInput({ onSearch, searchHistory }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

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
    
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
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
            placeholder="请输入城市名（支持中文）"
            className="w-full px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white"
          />
          
          {/* 搜索建议下拉框 */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-left text-gray-800 dark:text-white"
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
