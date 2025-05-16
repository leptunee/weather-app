import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // 从 localStorage 获取初始状态，如果没有则使用系统偏好
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { t } = useTranslation();

  useEffect(() => {
    // 更新 HTML 的 class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 保存到 localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur
                 hover:bg-white dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full
                 transition-all duration-300 ease-in-out transform hover:scale-110
                 shadow-lg hover:shadow-xl active:scale-95
                 border border-blue-100 dark:border-blue-900"
      title={darkMode ? t('light_mode') : t('dark_mode')}
    >
      <div className="w-6 h-6 flex items-center justify-center group-hover:animate-pulse">
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </div>
    </button>
  );
}

export default DarkModeToggle;
