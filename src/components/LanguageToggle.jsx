import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const languages = [
    { code: 'zh', label: '简体中文' },
    { code: 'en', label: 'English' }
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur
                 hover:bg-white dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full
                 transition-all duration-300 ease-in-out transform hover:scale-110
                 shadow-lg hover:shadow-xl active:scale-95
                 border border-blue-100 dark:border-blue-900"
        title="切换语言 / Change Language"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex items-center justify-center group-hover:animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 stroke-current"
          >
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-36 py-1
                   bg-white dark:bg-gray-800 rounded-lg shadow-lg
                   border border-gray-100 dark:border-gray-700
                   backdrop-blur-lg animate-fade-in z-50"
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full px-4 py-2 text-sm text-left
                       transition-colors duration-150 ease-in-out
                       ${code === i18n.language
                         ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                       }`}
            >
              <div className="flex items-center gap-2">
                <span>{label}</span>
                {code === i18n.language && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
