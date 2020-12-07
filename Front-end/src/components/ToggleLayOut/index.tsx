import React, { useContext }  from "react";
import { ReactComponent as MoonIcon } from "@/Images/moon.svg";
import { ReactComponent as SunIcon } from "@/Images/sun.svg";
import { ThemeContext } from "@/contexts/ThemeContext";
import THEME from "@/constants/Theme";
import "./style.scss"

const ToggleLayOut: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { userTheme, theme, userThemeChange } = useContext(ThemeContext);

  const handleChangeTheme = () => {
    if (userThemeChange) {
      if (userTheme === THEME.LIGHT) {
        userThemeChange(THEME.DARK);
      } else {
        userThemeChange(THEME.LIGHT);
      }
    }
  };

  return (
    <div className="ToggleLayOut">
      <button style={{background:theme?.gradient,border:`2px solid ${theme?.toggleBorder}`}} className="ToggleLayOut__button" onClick={handleChangeTheme}>
        <SunIcon width="25" height="25" style={{transform: userTheme===THEME.LIGHT ? 'translateY(0)' : 'translateY(100px)'}}/>
        <MoonIcon width="25" height="25" style={{transform: userTheme===THEME.LIGHT ? 'translateY(-100px)' : 'translateY(0px)'}}/>      
      </button>
      {children}
    </div>
  );
};

export default ToggleLayOut;
