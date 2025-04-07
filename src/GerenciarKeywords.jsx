import { useState } from "react";
import { motion } from "framer-motion";
import { useKeywords } from "./contexts/KeywordsContext";
import { ColorPicker } from "./components/ColorPicker";
import { toast } from "react-toastify";

const GerenciarKeywords = ({ onBack }) => {
  const { keywords, addKeyword, updateKeyword, deleteKeyword } = useKeywords();
  const [newKeyword, setNewKeyword] = useState("");
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [selectedColor, setSelectedColor] = useState({
    name: "Azul",
    bg: "bg-blue-100",
    text: "text-blue-800",
    darkBg: "dark:bg-blue-800",
    darkText: "dark:text-blue-200",
    preview: "bg-blue-600",
  });

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error("A palavra-chave não pode estar vazia");
      return;
    }

    const success = addKeyword({
      texto: newKeyword.trim(),
      cor: selectedColor,
    });

    if (success) {
      toast.success(
        `Palavra-chave "${newKeyword.trim()}" adicionada com sucesso`
      );
      setNewKeyword("");
    } else {
      toast.error(`A palavra-chave "${newKeyword.trim()}" já existe`);
    }
  };

  const handleUpdate = () => {
    if (!editingKeyword || !editingKeyword.texto.trim()) {
      toast.error("A palavra-chave não pode estar vazia");
      return;
    }

    updateKeyword(editingKeyword.originalText, {
      texto: editingKeyword.texto.trim(),
      cor: editingKeyword.cor,
    });

    toast.success("Palavra-chave atualizada com sucesso");
    setEditingKeyword(null);
  };

  const handleDelete = (keyword) => {
    deleteKeyword(keyword.texto);
    toast.success(`Palavra-chave "${keyword.texto}" excluída com sucesso`);
  };

  const startEditing = (keyword) => {
    setEditingKeyword({
      ...keyword,
      originalText: keyword.texto,
    });
  };

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
          Gerenciar Palavras-chave
        </h1>
        <div className="w-6"></div>
      </div>

      {/* Add new keyword section */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Adicionar Nova Palavra-chave
        </h2>
        <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Texto da Palavra-chave
            </label>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Digite a palavra-chave..."
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cor
            </label>
            <ColorPicker
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />
          </div>
          <button
            onClick={handleAddKeyword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg mt-2 md:mt-0"
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
            Adicionar
          </button>
        </div>
      </div>

      {/* Preview section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Pré-visualização
        </h2>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedColor.bg} ${selectedColor.text} ${selectedColor.darkBg} ${selectedColor.darkText}`}
          >
            {newKeyword || "Exemplo"}
          </span>
        </div>
      </div>

      {/* Existing keywords */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          Palavras-chave Existentes
          <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
            {keywords.length}
          </span>
        </h2>

        {keywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            Nenhuma palavra-chave cadastrada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {editingKeyword &&
                editingKeyword.originalText === keyword.texto ? (
                  <div className="flex flex-wrap md:flex-nowrap items-end gap-4 w-full">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto
                      </label>
                      <input
                        type="text"
                        value={editingKeyword.texto}
                        onChange={(e) =>
                          setEditingKeyword({
                            ...editingKeyword,
                            texto: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="w-full md:w-1/4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cor
                      </label>
                      <ColorPicker
                        selectedColor={editingKeyword.cor}
                        onSelect={(color) =>
                          setEditingKeyword({ ...editingKeyword, cor: color })
                        }
                      />
                    </div>
                    <div className="flex gap-2 w-full md:w-1/4">
                      <button
                        onClick={handleUpdate}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingKeyword(null)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full ${keyword.cor.bg} ${keyword.cor.text} ${keyword.cor.darkBg} ${keyword.cor.darkText}`}
                      >
                        {keyword.texto}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(keyword)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(keyword)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GerenciarKeywords;
