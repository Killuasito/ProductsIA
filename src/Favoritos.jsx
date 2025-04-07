import { useContext } from "react";
import { motion } from "framer-motion";
import { useFavoritos } from "./contexts/FavoritosContext";
import { ProdutosContext } from "./ProdutosContext";

const Favoritos = ({ onBack }) => {
  const { favoritos } = useFavoritos();
  const { produtos } = useContext(ProdutosContext);

  const produtosFavoritos = produtos.filter((produto) =>
    favoritos.some((fav) => fav.codigo === produto.codigo)
  );

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
          Meus Favoritos
        </h1>
        <div className="w-6"></div>
      </div>

      {produtosFavoritos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-yellow-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Você ainda não tem produtos favoritos.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {produtosFavoritos.map((produto) => (
            <div
              key={produto.codigo}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start gap-4">
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.codigo}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {produto.codigo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {produto.descricao}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {produto.palavrasChave.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                      >
                        {typeof tag === "object" ? tag.texto : tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Favoritos;
