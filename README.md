# 天气查询应用

一个基于 React 和 Vite 构建的现代化天气查询应用，支持多语言、位置定位、城市收藏等功能。

## 功能特点

- 🌍 支持多语言（简体中文、繁体中文、日语、韩语、英语）
- 📍 支持获取当前位置天气
- ⭐ 城市收藏功能（支持拖拽排序）
- 🔍 智能搜索（支持拼音、中文、英文）
- 🎨 动态主题（根据天气状况和昼夜变化）
- 📱 响应式设计
- 🌙 深色模式支持
- 📖 搜索历史记录

## 技术栈

- React 19
- Vite 6
- TailwindCSS
- i18next
- dnd-kit（拖拽功能）
- OpenWeather API

## 快速开始

### 环境变量配置

1. 复制 `.env.example` 文件为 `.env`
2. 获取 OpenWeather API 密钥: [https://openweathermap.org/api](https://openweathermap.org/api)
3. 在 `.env` 中添加你的 API 密钥:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 截图示例

![主界面截图](/public/screenshot.png)

## 项目结构

```
src/
  ├── components/          # 组件
  │   ├── FavoritesList    # 收藏列表组件
  │   ├── LanguageToggle   # 语言切换组件
  │   ├── LocationWeather  # 位置天气组件
  │   ├── WeatherCard      # 天气卡片组件
  │   └── WeatherInput     # 搜索输入组件
  ├── hooks/              # 自定义 Hooks
  │   ├── useFavorites     # 收藏管理
  │   └── useWeatherHistory # 搜索历史管理
  ├── locales/           # 国际化文件
  │   ├── en/             # 英语
  │   ├── zh/             # 简体中文
  │   ├── zh-TW/          # 繁体中文
  │   ├── ja/             # 日语
  │   └── ko/             # 韩语
  ├── utils/             # 工具函数
  └── assets/            # 静态资源
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

# Weather Query Application

A modern weather query application built with React and Vite, supporting multiple languages, location-based weather, and city favorites.

## Features

- 🌍 Multi-language Support (Simplified Chinese, Traditional Chinese, Japanese, Korean, English)
- 📍 Current Location Weather
- ⭐ City Favorites (with drag-and-drop reordering)
- 🔍 Smart Search (supports Pinyin, Chinese, and English)
- 🎨 Dynamic Themes (based on weather conditions and day/night)
- 📱 Responsive Design
- 🌙 Dark Mode Support
- 📖 Search History

## Tech Stack

- React 19
- Vite 6
- TailwindCSS
- i18next
- dnd-kit (for drag and drop)
- OpenWeather API

## Quick Start

### Environment Variables

1. Copy `.env.example` to `.env`
2. Get OpenWeather API key: [https://openweathermap.org/api](https://openweathermap.org/api)
3. Add your API key to `.env`:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Screenshots

![Main Interface](/public/screenshot.png)

## Project Structure

```
src/
  ├── components/          # Components
  │   ├── FavoritesList    # Favorites list component
  │   ├── LanguageToggle   # Language switcher component
  │   ├── LocationWeather  # Location weather component
  │   ├── WeatherCard      # Weather card component
  │   └── WeatherInput     # Search input component
  ├── hooks/              # Custom Hooks
  │   ├── useFavorites     # Favorites management
  │   └── useWeatherHistory # Search history management
  ├── locales/           # i18n files
  │   ├── en/             # English
  │   ├── zh/             # Simplified Chinese
  │   ├── zh-TW/          # Traditional Chinese
  │   ├── ja/             # Japanese
  │   └── ko/             # Korean
  ├── utils/             # Utility functions
  └── assets/            # Static assets
```
