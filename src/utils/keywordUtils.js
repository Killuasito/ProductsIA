export const generateKeywords = async (text) => {
  try {
    // Lista expandida de stopwords específicas para produtos de iluminação
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
      "à",
      "às",
      "um",
      "uma",
      "uns",
      "umas",
      "este",
      "esta",
      "estes",
      "estas",
      "esse",
      "essa",
      "esses",
      "essas",
    ];

    // Identificadores de produtos de iluminação
    const lightingProducts = [
      "plafon",
      "pendente",
      "spot",
      "luminaria",
      "lampada",
      "refletor",
      "embutir",
      "sobrepor",
      "decorativo",
      "decor",
      "led",
      "lumos",
    ];

    // Especificações técnicas expandidas
    const specifications = [
      // Medidas elétricas
      ...(text.match(/\d+(?:[.,]\d+)?[WwVvAa]+/g) || []),
      // Medidas físicas
      ...(text.match(/\d+(?:[.,]\d+)?(?:mm|cm|m|kg)/g) || []),
      // Medidas com unidade separada
      ...(text.match(/\d+(?:[.,]\d+)?\s*(?:watts|volts|amperes)/gi) || []),
    ].map((spec) => spec.toLowerCase());

    // Materiais e acabamentos comuns em iluminação
    const materials = [
      "aluminio",
      "alumínio",
      "metal",
      "acrilico",
      "acrílico",
      "vidro",
      "policarbonato",
      "abs",
      "zamac",
      "inox",
    ];

    const finishes = [
      "preto",
      "branco",
      "cromado",
      "fosco",
      "acetinado",
      "microtextura",
      "texturizado",
      "brilhante",
      "escovado",
    ];

    // Limpa e normaliza o texto
    const cleanText = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, " ")
      .trim();

    // Divide em palavras
    const words = cleanText.split(/\s+/);

    // Filtra palavras relevantes
    const relevantWords = words.filter(
      (word) =>
        word.length > 2 &&
        !stopwords.includes(word) &&
        (lightingProducts.includes(word) ||
          materials.includes(word) ||
          finishes.includes(word) ||
          word.match(/^[0-9]+[wvak]$/i) || // Especificações técnicas
          word.match(/^[A-Z]/)) // Nomes próprios/marcas
    );

    // Combina todas as palavras-chave relevantes
    const allKeywords = new Set([
      ...specifications,
      ...relevantWords,
      ...words.filter((w) => lightingProducts.includes(w)),
      ...words.filter((w) => materials.includes(w)),
      ...words.filter((w) => finishes.includes(w)),
    ]);

    // Remove duplicatas e ordena por relevância
    return [...allKeywords]
      .sort((a, b) => {
        const aWeight = getKeywordWeight(a);
        const bWeight = getKeywordWeight(b);
        return bWeight - aWeight;
      })
      .slice(0, 12); // Aumenta o limite para capturar mais termos relevantes
  } catch (error) {
    console.error("Erro ao gerar palavras-chave:", error);
    return [];
  }
};

// Função auxiliar para determinar o peso das palavras-chave
const getKeywordWeight = (keyword) => {
  // Especificações técnicas têm prioridade máxima
  if (keyword.match(/^[0-9]+[wvak]$/i)) return 100;
  // Tipos de produtos têm prioridade alta
  if (["plafon", "pendente", "luminaria", "spot", "led"].includes(keyword))
    return 90;
  // Materiais têm prioridade média-alta
  if (["aluminio", "metal", "acrilico", "vidro"].includes(keyword)) return 80;
  // Acabamentos têm prioridade média
  if (["preto", "branco", "cromado", "microtextura"].includes(keyword))
    return 70;
  // Outras palavras têm prioridade normal
  return 50;
};
