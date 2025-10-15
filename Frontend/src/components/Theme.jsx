import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function Theme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "cupcake"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "cupcake" ? "dark" : "cupcake");
  };

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />

      <FaMoon className="swap-on h-6 w-6 text-blue-400" />

      <FaSun className="swap-off h-6 w-6 text-yellow-400" />
    </label>
  );
}

export default Theme;
