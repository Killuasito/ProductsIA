import { useContext, useState } from "react";
import { ProdutosContext } from "./ProdutosContext";
import { motion, AnimatePresence } from "framer-motion";
import DetalhesProduto from "./DetalhesProduto";
import { useToast } from "./contexts/ToastContext";
import { ImagePreview } from "./components/ImagePreview";
import { ColorPicker } from "./components/ColorPicker";

const ListarProdutos = ({ onBack }) => {
  const { produtos, deletarProduto, atualizarProduto, exportarProdutos } =
    useContext(ProdutosContext);
  const { addToast } = useToast();
  const [produtoParaDeletar, setProdutoParaDeletar] = useState(null);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const [produtoParaDetalhes, setProdutoParaDetalhes] = useState(null);
  const [editForm, setEditForm] = useState({
    codigo: "",
    descricao: "",
    palavrasChave: "",
    imagem: "", // Add image field
  });
  // Adicionando estados para filtro e ordenação
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("codigo");
  const [ordenarDirecao, setOrdenarDirecao] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedTagColors, setSelectedTagColors] = useState({});

  const handleDelete = (codigo) => {
    deletarProduto(codigo);
    setProdutoParaDeletar(null);
    addToast("Produto excluído com sucesso!");
  };

  const handleEdit = (produto) => {
    setProdutoParaEditar(produto);
    setEditForm({
      codigo: produto.codigo,
      descricao: produto.descricao,
      // Corrigir a exibição de palavras-chave
      palavrasChave: produto.palavrasChave
        .map((tag) => (typeof tag === "object" ? tag.texto : tag))
        .join(", "),
      imagem: produto.imagem || "",
    });
    // Restaurar as cores das tags
    const tagColors = {};
    produto.palavrasChave.forEach((tag) => {
      if (typeof tag === "object" && tag.cor) {
        tagColors[tag.texto] = tag.cor;
      }
    });
    setSelectedTagColors(tagColors);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          imagem: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    try {
      const palavrasArray = editForm.palavrasChave
        .split(",")
        .map((p) => p.trim())
        .map((palavra) => ({
          texto: palavra,
          cor: selectedTagColors[palavra] || {
            bg: "bg-blue-100",
            text: "text-blue-800",
            darkBg: "dark:bg-blue-800",
            darkText: "dark:text-blue-200",
          },
        }));

      atualizarProduto(produtoParaEditar.codigo, {
        ...editForm,
        palavrasChave: palavrasArray,
      });
      setProdutoParaEditar(null);
      addToast("Produto atualizado com sucesso!");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleExport = (formato) => {
    exportarProdutos(formato);
  };

  // Função para filtrar e ordenar produtos
  const produtosFiltradosOrdenados = () => {
    let resultado = [...produtos];

    // Filtrar por texto (se existir filtro)
    if (filtroTexto) {
      const textoLowerCase = filtroTexto.toLowerCase();
      resultado = resultado.filter(
        (produto) =>
          produto.codigo.toLowerCase().includes(textoLowerCase) ||
          produto.descricao.toLowerCase().includes(textoLowerCase) ||
          produto.palavrasChave.some((palavra) =>
            palavra.toLowerCase().includes(textoLowerCase)
          )
      );
    }

    // Ordenar resultados
    resultado.sort((a, b) => {
      const valorA = a[ordenarPor].toString().toLowerCase();
      const valorB = b[ordenarPor].toString().toLowerCase();

      if (ordenarDirecao === "asc") {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });

    return resultado;
  };

  const produtosExibidos = produtosFiltradosOrdenados();
  const totalProdutos = produtosExibidos.length;
  const totalPages = Math.ceil(totalProdutos / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = produtosExibidos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination controls component
  const Pagination = () => (
    <div className="mt-6 flex justify-center gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        }`}
      >
        Anterior
      </button>
      <span className="px-4 py-1 text-gray-600 dark:text-gray-300">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        }`}
      >
        Próxima
      </button>
    </div>
  );

  if (produtoParaDetalhes) {
    return (
      <DetalhesProduto
        produto={produtoParaDetalhes}
        onBack={() => setProdutoParaDetalhes(null)}
      />
    );
  }

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
          Produtos Cadastrados
        </h1>
        <div className="w-6"></div> {/* Spacer to maintain centering */}
      </div>

      {/* Barra de filtro e ordenação */}
      {produtos.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Filtrar produtos"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="pl-10 p-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <option value="codigo">Ordenar por Código</option>
                <option value="descricao">Ordenar por Descrição</option>
              </select>
              <button
                onClick={() =>
                  setOrdenarDirecao(ordenarDirecao === "asc" ? "desc" : "asc")
                }
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                title={
                  ordenarDirecao === "asc"
                    ? "Ordem crescente"
                    : "Ordem decrescente"
                }
              >
                {ordenarDirecao === "asc" ? (
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
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
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
                      d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum produto cadastrado ainda.
          </p>
        </div>
      ) : produtosExibidos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum produto corresponde ao filtro aplicado.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Exibindo {totalProdutos}{" "}
            {totalProdutos === 1 ? "produto" : "produtos"}
            {filtroTexto && ` para a busca "${filtroTexto}"`}
          </div>
          <div className="grid gap-4">
            {currentItems.map((produto) => (
              <div
                key={produto.codigo}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    {produto.imagem && (
                      <div
                        className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0 cursor-pointer"
                        onClick={() => setPreviewImage(produto.imagem)}
                      >
                        <img
                          src={produto.imagem}
                          alt={produto.codigo}
                          className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        />
                      </div>
                    )}
                    <div className="flex-grow w-full sm:w-auto">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {produto.codigo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {produto.descricao}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end mt-4 sm:mt-0">
                      <button
                        onClick={() => setProdutoParaDetalhes(produto)}
                        className="flex-1 sm:flex-initial p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 bg-gray-100 dark:bg-gray-600 rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="sr-only">Ver detalhes</span>
                      </button>
                      <button
                        onClick={() => handleEdit(produto)}
                        className="flex-1 sm:flex-initial p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-100 dark:bg-blue-900/50 rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="sr-only">Editar</span>
                      </button>
                      <button
                        onClick={() => setProdutoParaDeletar(produto)}
                        className="flex-1 sm:flex-initial p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 bg-red-100 dark:bg-red-900/50 rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="sr-only">Excluir</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {produto.palavrasChave.map((tag, i) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalProdutos > itemsPerPage && <Pagination />}

          {/* Export buttons at the bottom of the list */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleExport("pdf")}
              className="p-3 sm:px-6 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
              title="Exportar para PDF"
            >
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
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="p-3 sm:px-6 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2"
              title="Exportar para Excel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 3h18v18H3V3zm15 15V6H6v12h12zm-9-9h6v2h-6V9zm0 3h6v2h-6v-2z" />
              </svg>
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {produtoParaEditar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Editar Produto
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Imagem
                  </label>
                  <div className="flex items-center gap-4">
                    {editForm.imagem && (
                      <div className="relative">
                        <img
                          src={editForm.imagem}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() =>
                            setEditForm((prev) => ({ ...prev, imagem: "" }))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                    )}
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {editForm.imagem ? "Trocar imagem" : "Adicionar imagem"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={editForm.codigo}
                    disabled
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editForm.descricao}
                    onChange={(e) =>
                      setEditForm({ ...editForm, descricao: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Palavras-chave
                  </label>
                  <div className="space-y-2">
                    {editForm.palavrasChave.split(",").map((palavra, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={palavra.trim()}
                          onChange={(e) => {
                            const palavras = editForm.palavrasChave.split(",");
                            palavras[index] = e.target.value;
                            setEditForm({
                              ...editForm,
                              palavrasChave: palavras.join(","),
                            });
                          }}
                          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <ColorPicker
                          selectedColor={selectedTagColors[palavra.trim()]}
                          onSelect={(color) => {
                            setSelectedTagColors((prev) => ({
                              ...prev,
                              [palavra.trim()]: color,
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Separe as palavras-chave por vírgula
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setProdutoParaEditar(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {produtoParaDeletar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirmar exclusão
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Tem certeza que deseja excluir o produto{" "}
                <span className="font-semibold">
                  {produtoParaDeletar.codigo}
                </span>
                ? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setProdutoParaDeletar(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(produtoParaDeletar.codigo)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ImagePreview
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </motion.div>
  );
};

export default ListarProdutos;
