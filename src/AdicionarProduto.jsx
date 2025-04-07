import { useState, useContext, useEffect } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion } from "framer-motion";
import { KeywordGenerator } from "./components/KeywordGenerator";
import { generateKeywords } from "./utils/keywordUtils";
import { toast, ToastContainer } from "react-toastify";
import { useKeywords } from "./contexts/KeywordsContext";
import "react-toastify/dist/ReactToastify.css";

const AdicionarProduto = ({ onBack }) => {
  const { adicionarProduto } = useContext(ProdutosContext);
  const { keywords } = useKeywords();
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [showKeywordSelector, setShowKeywordSelector] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result);
        setImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratedKeywords = async (keywords) => {
    if (!descricao) {
      toast.error("Digite a descrição do produto primeiro!");
      return;
    }

    setPalavrasChave(keywords.join(", "));

    if (keywords.length > 0) {
      toast.success("Palavras-chave geradas com sucesso!");
    } else {
      toast.error(
        "Não foi possível gerar palavras-chave. Tente uma descrição mais detalhada."
      );
    }
  };

  const handleAdicionar = () => {
    if (
      !codigo ||
      !descricao ||
      (!palavrasChave.trim() && selectedKeywords.length === 0)
    ) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    // Process both manually entered keywords and selected global keywords
    const manualKeywords = palavrasChave
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Combine with selected global keywords
    const allKeywords = [
      ...manualKeywords.map((text) => {
        // Check if this matches any global keyword
        const globalMatch = keywords.find(
          (k) => k.texto.toLowerCase() === text.toLowerCase()
        );
        return globalMatch || { texto: text, cor: null };
      }),
      ...selectedKeywords.filter(
        (k) =>
          !manualKeywords.some((m) => m.toLowerCase() === k.texto.toLowerCase())
      ),
    ];

    // Additional validation to check if we have keywords after processing
    if (allKeywords.length === 0) {
      toast.error("Por favor, adicione pelo menos uma palavra-chave!");
      return;
    }

    const novoProduto = {
      codigo,
      descricao,
      palavrasChave: allKeywords,
      imagem: imagem,
    };

    adicionarProduto(novoProduto);
    toast.success("Produto adicionado com sucesso!");
    setCodigo("");
    setDescricao("");
    setPalavrasChave("");
    setSelectedKeywords([]);
    setImagemPreview(null);
    setImagem(null);
  };

  const toggleKeyword = (keyword) => {
    if (selectedKeywords.some((k) => k.texto === keyword.texto)) {
      setSelectedKeywords((prev) =>
        prev.filter((k) => k.texto !== keyword.texto)
      );
    } else {
      setSelectedKeywords((prev) => [...prev, keyword]);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-md mx-auto border border-gray-100 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            Cadastro de Produto
          </h1>
          <div className="w-6"></div>{" "}
          {/* Espaçador para centralizar o título */}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="codigo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Código do Produto
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
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
                    d="M7 7h10M7 12h10m-8 5h6"
                  />
                </svg>
              </span>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="border pl-10 p-3 w-full rounded-lg focus:ring-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 6N102203-EBB40"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Descrição
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-500 dark:text-gray-400">
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
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </span>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="border pl-10 p-3 w-full rounded-lg focus:ring-2 focus:outline-none border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-white min-h-[100px]"
                placeholder="Descreva o produto em detalhes..."
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="palavras-chave"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Palavras-chave
            </label>
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
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
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </span>
              <input
                id="palavras-chave"
                type="text"
                value={palavrasChave}
                onChange={(e) => setPalavrasChave(e.target.value)}
                className="border pl-10 p-3 w-full rounded-lg focus:ring-2 focus:outline-none border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: eletrônico, smartphone, tecnologia"
              />
              <KeywordGenerator onSelect={handleGeneratedKeywords} />
            </div>

            {/* Global keywords selector button - Replacing the text link with a button */}
            <div className="mt-3 flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Separe as palavras-chave por vírgula ou use o botão para gerar
                automaticamente
              </p>
              <button
                onClick={() => setShowKeywordSelector(!showKeywordSelector)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-1 text-xs font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                {showKeywordSelector
                  ? "Ocultar palavras globais"
                  : "Palavras globais"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    showKeywordSelector ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 24 24 4"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Global keywords selector */}
          {showKeywordSelector && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Palavras-chave globais
              </h3>

              {keywords.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Nenhuma palavra-chave global cadastrada.
                  <button
                    onClick={() => onBack("keywords")}
                    className="ml-1 text-blue-500 hover:underline"
                  >
                    Adicione algumas
                  </button>
                  .
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {keywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => toggleKeyword(keyword)}
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium flex items-center
                        ${keyword.cor.bg} ${keyword.cor.text} ${
                        keyword.cor.darkBg
                      } ${keyword.cor.darkText}
                        ${
                          selectedKeywords.some(
                            (k) => k.texto === keyword.texto
                          )
                            ? "ring-2 ring-offset-1 ring-blue-500"
                            : ""
                        }
                      `}
                    >
                      {keyword.texto}
                      {selectedKeywords.some(
                        (k) => k.texto === keyword.texto
                      ) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedKeywords.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Palavras-chave selecionadas ({selectedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${keyword.cor.bg} ${keyword.cor.text} ${keyword.cor.darkBg} ${keyword.cor.darkText}
                        `}
                      >
                        {keyword.texto}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campo de upload de imagem */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Imagem do Produto
            </label>
            <div className="mt-1 flex flex-col items-center">
              {imagemPreview ? (
                <div className="relative group">
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    className="w-full max-w-xs rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => {
                      setImagemPreview(null);
                      setImagem(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="w-full max-w-xs flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-400 rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.c74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-sm">Selecionar imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImagemChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handleAdicionar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 flex items-center justify-center mt-6 shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Adicionar Produto
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AdicionarProduto;
