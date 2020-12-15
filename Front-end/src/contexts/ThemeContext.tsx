// Libs
import React, { createContext, useState } from "react";

// others
import { lightTheme, darkTheme } from "@/configs/Theme";
import { THEME } from '@/types/Theme';
import THEME_MODE from '@/constants/Theme';

// create the theme context with default selected language
type ContextProps = {
  userTheme: string;
  theme: THEME;
  userThemeChange: (selected: string) => void;
};

export const ThemeContext = createContext<Partial<ContextProps>>({
  userTheme: THEME_MODE.LIGHT,
  theme: lightTheme,
  userThemeChange: () => {},
});

interface Props {
  children: JSX.Element[] | JSX.Element;
}

export const ThemeProviderLocal: React.FC<Props> = ({ children }) => {
  const [userTheme, setUserTheme] = useState(window.localStorage.getItem("theme")||THEME_MODE.LIGHT);

  const provider = {
    userTheme,
    theme: userTheme===THEME_MODE.LIGHT?lightTheme:darkTheme,
    userThemeChange: async (selected: string) => {
      setUserTheme(selected);
      await window.localStorage.setItem("theme", selected);
    },
  };

  return (
    <ThemeContext.Provider value={provider}>
      {children}
    </ThemeContext.Provider>
  );
};
