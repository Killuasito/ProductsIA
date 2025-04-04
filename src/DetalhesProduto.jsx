import { useContext } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion } from "framer-motion";

const DetalhesProduto = ({ produto, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700"
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
          Detalhes do Produto
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="space-y-8">
        {/* Cabeçalho do produto */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl p-6">
          <h2 className="text-3xl font-bold">{produto.codigo}</h2>
          <p className="mt-2 text-blue-100">{produto.descricao}</p>
        </div>

        {/* Imagem do produto */}
        {produto.imagem && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Imagem do Produto
            </h3>
            <div className="flex justify-center">
              <img
                src={produto.imagem}
                alt={produto.codigo}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Informações do produto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Palavras-chave */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Palavras-chave
            </h3>
            <div className="flex flex-wrap gap-2">
              {produto.palavrasChave.map((palavra, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full ${
                    typeof palavra === "object" && palavra.cor
                      ? `${palavra.cor.bg} ${palavra.cor.text} ${palavra.cor.darkBg} ${palavra.cor.darkText}`
                      : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                  } text-sm font-medium`}
                >
                  {typeof palavra === "object" ? palavra.texto : palavra}
                </span>
              ))}
            </div>
          </div>

          {/* Data de criação e atualização */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Datas
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Criado em
                </p>
                <p className="text-gray-800 dark:text-white">
                  {new Date(produto.dataCriacao).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {produto.dataAtualizacao && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Última atualização
                  </p>
                  <p className="text-gray-800 dark:text-white">
                    {new Date(produto.dataAtualizacao).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code do produto */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            QR Code do Produto
          </h3>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `Código: ${produto.codigo}
                Descrição: ${produto.descricao}
                Palavras-chave: ${produto.palavrasChave
                  .map((palavra) =>
                    typeof palavra === "object" ? palavra.texto : palavra
                  )
                  .join(", ")}`
              )}`}
              alt="QR Code do produto"
              className="bg-white p-4 rounded-lg"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetalhesProduto;
