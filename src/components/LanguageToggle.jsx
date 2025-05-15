import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 p-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur hover:bg-white/80 dark:hover:bg-white/20 transition-all group"
      aria-label={i18n.language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <div className="flex items-center gap-2">
        <svg 
          viewBox="0 0 24 24" 
          className="w-5 h-5 text-gray-700 dark:text-white"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          {i18n.language === 'zh' ? 'EN' : '中'}
        </span>
      </div>
      <span className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
      </span>
    </button>
  );
};

export default LanguageToggle;
