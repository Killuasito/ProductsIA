import { useContext, useMemo } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion } from "framer-motion";

const Dashboard = ({ onBack }) => {
  const { produtos } = useContext(ProdutosContext);

  // Calcular estatísticas dos produtos
  const estatisticas = useMemo(() => {
    if (!produtos.length) {
      return {
        totalProdutos: 0,
        palavrasChavesUnicas: 0,
        topPalavrasChave: [],
        produtosMaisRecentes: [],
        produtosComMaisPalavrasChave: [],
      };
    }

    // Contagem de palavras-chave
    const contagemPalavras = {};
    produtos.forEach((produto) => {
      produto.palavrasChave.forEach((palavra) => {
        const texto = typeof palavra === "object" ? palavra.texto : palavra;
        contagemPalavras[texto] = (contagemPalavras[texto] || 0) + 1;
      });
    });

    // Top 5 palavras-chave
    const topPalavrasChave = Object.entries(contagemPalavras)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([palavra, contagem]) => ({ palavra, contagem }));

    // Produtos com mais palavras-chave
    const produtosComMaisPalavrasChave = [...produtos]
      .sort((a, b) => b.palavrasChave.length - a.palavrasChave.length)
      .slice(0, 3);

    // Produtos mais recentes (se houver dataCriacao)
    const produtosComData = produtos.filter((p) => p.dataCriacao);
    const produtosMaisRecentes =
      produtosComData.length > 0
        ? [...produtosComData]
            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
            .slice(0, 3)
        : produtos.slice(-3).reverse();

    return {
      totalProdutos: produtos.length,
      palavrasChavesUnicas: Object.keys(contagemPalavras).length,
      topPalavrasChave,
      produtosMaisRecentes,
      produtosComMaisPalavrasChave,
    };
  }, [produtos]);

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
          Dashboard
        </h1>
        <div className="w-6"></div>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum produto cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cartões de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/90 font-medium">Total de Produtos</p>
                  <h2 className="text-3xl font-bold mt-1 text-white">
                    {estatisticas.totalProdutos}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/90 font-medium">
                    Palavras-chave Únicas
                  </p>
                  <h2 className="text-3xl font-bold mt-1 text-white">
                    {estatisticas.palavrasChavesUnicas}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
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
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/90 font-medium">
                    Média de Palavras-chave
                  </p>
                  <h2 className="text-3xl font-bold mt-1 text-white">
                    {(
                      produtos.reduce(
                        (acc, prod) => acc + prod.palavrasChave.length,
                        0
                      ) / produtos.length
                    ).toFixed(1)}
                  </h2>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top palavras-chave */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Top Palavras-chave
            </h3>
            {estatisticas.topPalavrasChave.length > 0 ? (
              <div className="space-y-3">
                {estatisticas.topPalavrasChave.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.palavra}
                      </span>
                    </div>
                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                (item.contagem /
                                  estatisticas.topPalavrasChave[0].contagem) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {item.contagem}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma palavra-chave encontrada.
              </p>
            )}
          </div>

          {/* Produtos recentes */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Produtos Adicionados Recentemente
            </h3>
            {estatisticas.produtosMaisRecentes.length > 0 ? (
              <div className="space-y-3">
                {estatisticas.produtosMaisRecentes.map((produto) => (
                  <div
                    key={produto.codigo}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {produto.codigo}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {produto.descricao}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {produto.palavrasChave.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-full ${
                            typeof tag === "object" && tag.cor
                              ? `${tag.cor.bg} ${tag.cor.text} ${tag.cor.darkBg} ${tag.cor.darkText}`
                              : "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                          } text-xs font-medium`}
                        >
                          {typeof tag === "object" ? tag.texto : tag}
                        </span>
                      ))}
                      {produto.palavrasChave.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium">
                          +{produto.palavrasChave.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum produto cadastrado recentemente.
              </p>
            )}
          </div>

          {/* Produtos com mais palavras-chave */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Produtos com Mais Palavras-chave
            </h3>
            {estatisticas.produtosComMaisPalavrasChave.length > 0 ? (
              <div className="space-y-3">
                {estatisticas.produtosComMaisPalavrasChave.map((produto) => (
                  <div
                    key={produto.codigo}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {produto.codigo}
                      </h4>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                        {produto.palavrasChave.length} palavras-chave
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1 mt-1">
                      {produto.descricao}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum produto encontrado.
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
