import { useState } from "react";
import WeatherInput from "./components/WeatherInput";
import WeatherCard from "./components/WeatherCard";
import { useWeatherHistory } from './hooks/useWeatherHistory';

function App() {  const [city, setCity] = useState("");
  const { history, addToHistory, clearHistory } = useWeatherHistory();

  const handleSearch = (input) => {
    setCity(input);
    addToHistory(input);
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">天气查询</h1>        <WeatherInput 
          onSearch={handleSearch} 
          searchHistory={history}
          onClearHistory={handleClearHistory}
        />
        {city && <WeatherCard city={city} />}
      </div>
    </div>
  );
}

export default App;
