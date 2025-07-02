"use client";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

const ThemeToggle = () => {
    const { theme, toggle } = useContext(ThemeContext);

    return (
        <button
            onClick={toggle}
            className="px-3 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-900
                 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-300"
            aria-label="Toggle dark mode"
            type="button"
        >
            {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
    );
};

export default ThemeToggle;
