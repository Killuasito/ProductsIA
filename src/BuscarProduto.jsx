import { useState, useContext } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion } from "framer-motion";

const BuscarProduto = ({ onBack }) => {
  const { buscarProdutosPorSimilaridade } = useContext(ProdutosContext);
  const [descricao, setDescricao] = useState("");
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);

  const buscarProduto = () => {
    if (!descricao) return;

    setBuscando(true);
    setResultados(null); // Limpa resultados anteriores

    // Adiciona mensagem amigável antes da busca
    setResultados([
      {
        friendly: "Bom, vamos ver o que tenho...",
      },
    ]);

    // Reduzindo o delay para 1.2 segundos
    setTimeout(() => {
      try {
        const produtosEncontrados = buscarProdutosPorSimilaridade(descricao);

        // Reduzindo o delay extra para 300ms
        setTimeout(() => {
          setResultados(
            produtosEncontrados.length > 0
              ? produtosEncontrados
              : [{ error: "Nenhum produto correspondente encontrado." }]
          );
          setBuscando(false);
        }, 300);
      } catch (error) {
        setResultados([{ error: error.message }]);
        setBuscando(false);
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-md mx-auto border border-gray-100 dark:border-gray-700 mt-6"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 transform hover:scale-110"
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
          Consulta de Produtos
        </h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="descricao-busca"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Descrição do Produto
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 text-gray-500">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <textarea
              id="descricao-busca"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border pl-10 p-3 w-full rounded-lg focus:ring-2 focus:outline-none text-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 min-h-[100px]"
              placeholder="Descreva o produto que deseja encontrar..."
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Inclua palavras-chave relevantes para uma busca mais precisa
          </p>
        </div>

        <button
          onClick={buscarProduto}
          disabled={buscando}
          className={`${
            buscando ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 flex items-center justify-center mt-4 shadow-md hover:shadow-lg`}
        >
          {buscando ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Buscando...
            </>
          ) : (
            <>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar Produto
            </>
          )}
        </button>

        {resultados && (
          <div className="mt-6 space-y-4">
            {resultados[0].friendly ? (
              <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/50 p-4">
                <div className="flex items-center text-blue-600 dark:text-blue-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    {resultados[0].friendly}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/50 p-4 mb-4">
                  <div className="flex items-center text-blue-600 dark:text-blue-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-lg font-medium">
                      Esses são os resultados de sua pesquisa
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-2">
                  {resultados[0].error
                    ? "Resultado da Busca"
                    : `Resultados Encontrados (${resultados.length})`}
                </h3>

                {resultados[0].error ? (
                  <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/50 p-4">
                    <div className="flex items-center text-red-600 dark:text-red-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
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
                      {resultados[0].error}
                    </div>
                  </div>
                ) : (
                  resultados.map((resultado, index) => (
                    <div
                      key={resultado.codigo}
                      className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/50 p-4"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Relevância: {resultado.relevancia}%
                          </span>
                        </div>

                        {resultado.relevancia < 100 && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-yellow-600 dark:text-yellow-200 flex-shrink-0 mt-0.5"
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
                              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                <p className="font-medium mb-1">
                                  Produto similar encontrado
                                </p>
                                <p>
                                  Este produto tem algumas diferenças em relação
                                  à sua busca. Verifique as palavras-chave
                                  abaixo para confirmar se é o que você procura.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-start">
                            {resultado.imagem && (
                              <div className="flex-shrink-0 mr-4">
                                <img
                                  src={resultado.imagem}
                                  alt={resultado.codigo}
                                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                                />
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 pt-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-600 dark:text-green-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Código do Produto
                                  </p>
                                  <p className="text-lg font-semibold text-green-600 dark:text-green-200">
                                    {resultado.codigo}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="flex-shrink-0 pt-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-green-600 dark:text-green-200"
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
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Descrição
                                  </p>
                                  <p className="text-gray-700 dark:text-gray-400">
                                    {resultado.descricao}
                                  </p>
                                </div>
                              </div>

                              {resultado.palavrasChave && (
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 pt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-green-600 dark:text-green-200"
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
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                      Palavras-chave
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {resultado.palavrasChave.map(
                                        (palavra, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium"
                                          >
                                            {typeof palavra === "object"
                                              ? palavra.texto ||
                                                JSON.stringify(palavra)
                                              : palavra}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BuscarProduto;
