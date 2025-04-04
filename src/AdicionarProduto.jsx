import { useState, useContext } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion } from "framer-motion";

const AdicionarProduto = ({ onBack }) => {
  const { adicionarProduto } = useContext(ProdutosContext);
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso"); // "sucesso" ou "erro"
  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagem, setImagem] = useState(null);

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

  const handleAdicionar = () => {
    if (!codigo || !descricao || !palavrasChave) {
      setMensagem("Por favor, preencha todos os campos!");
      setTipoMensagem("erro");
      return;
    }

    const palavrasArray = palavrasChave.split(",").map((p) => p.trim());
    const novoProduto = {
      codigo,
      descricao,
      palavrasChave: palavrasArray,
      imagem: imagem, // Adiciona a imagem
    };

    adicionarProduto(novoProduto);
    setMensagem("Produto adicionado com sucesso!");
    setTipoMensagem("sucesso");
    setCodigo("");
    setDescricao("");
    setPalavrasChave("");
    setImagemPreview(null);
    setImagem(null);
  };

  return (
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
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
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
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separe as palavras-chave por vírgula
          </p>
        </div>

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
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
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

        {mensagem && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              tipoMensagem === "sucesso"
                ? "bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-800"
                : "bg-red-100 dark:bg-red-200 text-red-700 dark:text-red-800"
            } flex items-center transition-all duration-300`}
          >
            <span className="mr-2">
              {tipoMensagem === "sucesso" ? (
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
                    d="M5 13l4 4L19 7"
                  />
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </span>
            {mensagem}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdicionarProduto;
