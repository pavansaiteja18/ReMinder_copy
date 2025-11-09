import { useThemeStore } from '@/store/themeStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  
  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
};
