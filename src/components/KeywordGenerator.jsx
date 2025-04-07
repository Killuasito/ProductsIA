import { useState } from "react";
import { generateKeywords } from "../utils/keywordUtils";

export function KeywordGenerator({ onSelect }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleGenerate = async (text) => {
    setIsGenerating(true);
    try {
      const keywords = await generateKeywords(text);
      onSelect(keywords);
    } catch (error) {
      console.error("Erro ao gerar palavras-chave:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={async () => {
          const textField = document.querySelector("#descricao");
          if (!textField?.value) return;
          setShowWarning(true);
          await handleGenerate(textField.value);
          setTimeout(() => setShowWarning(false), 5000); // Hide warning after 5s
        }}
        onMouseEnter={() => setShowWarning(true)}
        onMouseLeave={() => !isGenerating && setShowWarning(false)}
        disabled={isGenerating}
        className="ml-2 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        title="Gerar palavras-chave da descrição"
      >
        {isGenerating ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
      </button>

      {/* Warning tooltip */}
      {showWarning && (
        <div className="absolute right-0 top-full mt-2 z-10 w-64 p-3 text-xs bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg">
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-yellow-800 dark:text-yellow-200">
              As palavras-chave são geradas automaticamente e podem conter
              erros. Por favor, revise e ajuste conforme necessário.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
