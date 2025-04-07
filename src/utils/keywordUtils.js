export const generateKeywords = async (text) => {
  try {
    // Palavras para ignorar
    const stopwords = [
      "de",
      "com",
      "em",
      "na",
      "no",
      "para",
      "por",
      "e",
      "a",
      "o",
      "as",
      "os",
      "do",
      "da",
      "dos",
      "das",
      "ao",
      "aos",
      "um",
      "uma",
    ];

    // Normaliza e limpa o texto
    const cleanText = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .trim();

    // Divide em palavras e filtra
    const words = cleanText.split(/\s+/).filter(
      (word) =>
        word.length > 2 && !stopwords.includes(word) && !word.match(/^[0-9]+$/) // Remove números isolados
    );

    // Remove duplicatas e limita a quantidade
    const uniqueWords = [...new Set(words)];

    return uniqueWords.slice(0, 8);
  } catch (error) {
    console.error("Erro ao gerar palavras-chave:", error);
    return [];
  }
};
