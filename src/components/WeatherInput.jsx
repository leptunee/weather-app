import { useState } from "react";
import { pinyin } from "pinyin-pro";

function WeatherInput({ onSearch }) {
  const [city, setCity] = useState("");

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="请输入城市名（支持中文）"
        className="flex-1 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        查询
      </button>
    </form>
  );
}

export default WeatherInput;
