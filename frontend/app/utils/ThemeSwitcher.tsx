"use client";

import * as React from "react";
import { BiSun, BiMoon } from "react-icons/bi";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <BiMoon
          onClick={() => setTheme("dark")}
          className="cursor-pointer text-black dark:text-white w-6 h-6"
        />
      ) : (
        <BiSun
          onClick={() => setTheme("light")}
          className="cursor-pointer text-black dark:text-white w-6 h-6"
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
