import { createContext, useContext, useState, useEffect } from "react";

const KeywordsContext = createContext();

export function KeywordsProvider({ children }) {
  const [keywords, setKeywords] = useState(() => {
    const savedKeywords = localStorage.getItem("globalKeywords");
    return savedKeywords ? JSON.parse(savedKeywords) : [];
  });

  useEffect(() => {
    localStorage.setItem("globalKeywords", JSON.stringify(keywords));
  }, [keywords]);

  const addKeyword = (keyword) => {
    if (!keyword.texto || !keyword.cor) return false;

    // Check if keyword already exists
    const existingKeyword = keywords.find(
      (k) => k.texto.toLowerCase() === keyword.texto.toLowerCase()
    );
    if (existingKeyword) return false;

    setKeywords((prev) => [...prev, keyword]);
    return true;
  };

  const updateKeyword = (oldText, newKeyword) => {
    setKeywords((prev) =>
      prev.map((k) =>
        k.texto.toLowerCase() === oldText.toLowerCase() ? newKeyword : k
      )
    );
  };

  const deleteKeyword = (text) => {
    setKeywords((prev) =>
      prev.filter((k) => k.texto.toLowerCase() !== text.toLowerCase())
    );
  };

  const getKeyword = (text) => {
    return keywords.find((k) => k.texto.toLowerCase() === text.toLowerCase());
  };

  return (
    <KeywordsContext.Provider
      value={{
        keywords,
        addKeyword,
        updateKeyword,
        deleteKeyword,
        getKeyword,
      }}
    >
      {children}
    </KeywordsContext.Provider>
  );
}

export const useKeywords = () => useContext(KeywordsContext);
