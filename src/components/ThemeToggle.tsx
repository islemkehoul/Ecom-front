import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-200 ${theme === 'light'
                            ? 'rotate-0 opacity-100 scale-100'
                            : 'rotate-90 opacity-0 scale-0'
                        }`}
                />

                {/* Moon Icon */}
                <Moon
                    className={`absolute inset-0 w-5 h-5 text-slate-700 dark:text-slate-200 transition-all duration-200 ${theme === 'dark'
                            ? 'rotate-0 opacity-100 scale-100'
                            : '-rotate-90 opacity-0 scale-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
