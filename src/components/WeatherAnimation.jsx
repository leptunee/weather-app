import React from 'react';

const WeatherAnimation = ({ type }) => {
  const renderAnimation = () => {
    switch (type) {
      case 'clear-day':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500/30">
            <circle cx="50" cy="50" r="20" className="fill-current animate-pulse"/>
            <g className="animate-spin-slow origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line 
                  key={angle}
                  x1="50"
                  y1="25"
                  x2="50"
                  y2="15"
                  className="stroke-current stroke-2"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
            </g>
          </svg>
        );
      case 'clear-night':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-300/30">
            <path
              d="M50 75C37.5 75 27.5 65 27.5 52.5C27.5 40 37.5 30 50 30C45 40 45 55 55 65C50 72.5 42.5 75 50 75Z"
              className="fill-current animate-pulse"
            />
          </svg>
        );
      case 'cloudy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-400/30">
            <g className="animate-float">
              <path
                d="M25 60C25 46.2 36.2 35 50 35C63.8 35 75 46.2 75 60"
                className="fill-none stroke-current stroke-[8]"
              />
              <circle cx="50" cy="60" r="20" className="fill-current"/>
            </g>
          </svg>
        );
      case 'rainy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400/30">
            <g className="animate-float">
              <path
                d="M25 40C25 26.2 36.2 15 50 15C63.8 15 75 26.2 75 40"
                className="fill-none stroke-current stroke-[8]"
              />
              <circle cx="50" cy="40" r="20" className="fill-current"/>
            </g>
            {[30, 50, 70].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1="70"
                x2={x}
                y2="85"
                className="stroke-current stroke-2 animate-rain"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        );
      case 'snow':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200/30">
            <g className="animate-float">
              <path
                d="M25 40C25 26.2 36.2 15 50 15C63.8 15 75 26.2 75 40"
                className="fill-none stroke-current stroke-[8]"
              />
              <circle cx="50" cy="40" r="20" className="fill-current"/>
            </g>
            {[30, 50, 70].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={70 + i * 10}
                r="2"
                className="fill-current animate-snow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        );
      case 'storm':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-500/30">
            <g className="animate-float">
              <path
                d="M25 40C25 26.2 36.2 15 50 15C63.8 15 75 26.2 75 40"
                className="fill-none stroke-current stroke-[8]"
              />
              <circle cx="50" cy="40" r="20" className="fill-current"/>
            </g>
            <path
              d="M45 60L55 75L45 75L55 90"
              className="stroke-yellow-400/50 stroke-[3] fill-none animate-flash"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {renderAnimation()}
    </div>
  );
};

export default WeatherAnimation;
