import React, { useState } from "react";
import styles from "./index.module.css";
import { useTheme } from "../../context/ThemeContext";
import HomeIcon from "../../assets/icons/home.svg";
import AdminIcon from "../../assets/icons/admin.svg";
import ThemeLightIcon from "../../assets/icons/theme_light.svg";
import ThemeDarkIcon from "../../assets/icons/theme_dark.svg";

interface SidebarProps {
  items: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${
        theme === "dark" ? styles.darkTheme : ""
      }`}
    >
      <div className={styles.header}>
        {!isCollapsed && <h2>ガントチャート</h2>} {/* 折りたたみ時非表示 */}
        <button onClick={toggleCollapse} className={styles.collapseButton}>
          &lt;
        </button>
      </div>

      {isCollapsed ? (
        <div className={styles.collapsedIcons}>
          <img
            src={HomeIcon}
            alt="Home"
            className={styles.collapsedIcon}
            onClick={() => {
              console.log("Go to Home");
            }}
          />
          <img
            src={AdminIcon}
            alt="Admin"
            className={styles.collapsedIcon}
            onClick={() => {
              console.log("Go to Admin");
            }}
          />
          <img
            src={theme === "willow" ? ThemeDarkIcon : ThemeLightIcon}
            alt="Theme"
            className={styles.collapsedIcon}
            onClick={toggleTheme}
          />
        </div>
      ) : (
        <>
          <div className={styles.themeSwitcher}>
            <button
              className={`${styles.themeButton} ${
                theme === "willow" ? styles.active : ""
              }`}
              onClick={toggleTheme}
            >
              ライト
            </button>
            <button
              className={`${styles.themeButton} ${
                theme === "dark" ? styles.active : ""
              }`}
              onClick={toggleTheme}
            >
              ダーク
            </button>
          </div>

          <ul className={styles.menu}>
            {items.map((item, index) => (
              <li key={index} className={styles.menuItem}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
