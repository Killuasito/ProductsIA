import { useState } from "react";

const defaultColors = [
  {
    name: "Azul",
    bg: "bg-blue-100",
    text: "text-blue-800",
    darkBg: "dark:bg-blue-800",
    darkText: "dark:text-blue-200",
    preview: "bg-blue-600",
  },
  {
    name: "Vermelho",
    bg: "bg-red-100",
    text: "text-red-800",
    darkBg: "dark:bg-red-800",
    darkText: "dark:text-red-200",
    preview: "bg-red-600",
  },
  {
    name: "Verde",
    bg: "bg-green-100",
    text: "text-green-800",
    darkBg: "dark:bg-green-800",
    darkText: "dark:text-green-200",
    preview: "bg-green-600",
  },
  {
    name: "Amarelo",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    darkBg: "dark:bg-yellow-800",
    darkText: "dark:text-yellow-200",
    preview: "bg-yellow-600",
  },
  {
    name: "Roxo",
    bg: "bg-purple-100",
    text: "text-purple-800",
    darkBg: "dark:bg-purple-800",
    darkText: "dark:text-purple-200",
    preview: "bg-purple-600",
  },
];

export function ColorPicker({ onSelect, selectedColor }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-700 
          hover:bg-gray-200 dark:hover:bg-gray-600
          border border-gray-300 dark:border-gray-600
          text-gray-700 dark:text-gray-200
          transition-colors duration-200
        `}
        title="Escolher cor da tag"
      >
        <div
          className={`w-4 h-4 rounded-full ${
            selectedColor?.preview || defaultColors[0].preview
          }`}
        />
        <span className="text-sm">Cor</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 p-3 
                        bg-white dark:bg-gray-800 
                        rounded-lg shadow-xl 
                        border border-gray-200 dark:border-gray-700 
                        z-50 min-w-[160px]"
        >
          <div className="grid gap-2">
            {defaultColors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(color);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-3 p-2 w-full rounded-lg
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-200
                  ${
                    selectedColor === color
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                `}
              >
                <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
