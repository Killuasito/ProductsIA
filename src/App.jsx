import { useState } from "react";
import { ProdutosProvider } from "./ProdutosContext";
import { ThemeProvider, useTheme } from "./ThemeContext";
import AdicionarProduto from "./AdicionarProduto";
import BuscarProduto from "./BuscarProduto";
import ListarProdutos from "./ListarProdutos";
import Dashboard from "./Dashboard"; // Importando o novo componente
import { motion, AnimatePresence } from "framer-motion";
import { UserProvider, useUser } from "./UserContext";
import { ToastProvider } from "./contexts/ToastContext";

function NamePrompt({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Bem-vindo ao Products IA
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Como posso te chamar?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:outline-none duration-250 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Digite seu nome"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Continuar
        </button>
      </form>
    </motion.div>
  );
}

function MainContent() {
  const [activePage, setActivePage] = useState("home");
  const { darkMode, toggleTheme } = useTheme();
  const { userName, updateUserName } = useUser();

  const navigateTo = (page) => {
    setActivePage(page);
  };

  if (!userName) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        } p-4`}
      >
        <NamePrompt onSubmit={updateUserName} />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "adicionar":
        return <AdicionarProduto onBack={() => navigateTo("home")} />;
      case "buscar":
        return <BuscarProduto onBack={() => navigateTo("home")} />;
      case "listar":
        return <ListarProdutos onBack={() => navigateTo("home")} />;
      case "dashboard":
        return <Dashboard onBack={() => navigateTo("home")} />;
      default:
        return (
          <div className="max-w-xl w-full mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-8 mt-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  {/* Círculo externo com animação mais lenta */}
                  <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-500 animate-[spin_3s_linear_infinite]"></div>
                  {/* Círculo interno */}
                  <div className="absolute inset-3 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-600"
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

              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Olá, {userName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                O que você gostaria de fazer hoje?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
              <div
                onClick={() => navigateTo("buscar")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-500 bg-opacity-20 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
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
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Buscar Produtos
                    </h3>
                    <p className="text-blue-100">
                      Encontrar códigos de produtos pelo texto descritivo
                    </p>
                  </div>
                  <div className="ml-auto transform group-hover:translate-x-1 transition-transform duration-200">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Container de Adicionar Produto */}
              <div
                onClick={() => navigateTo("adicionar")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-100 bg-opacity-20 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
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
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Cadastrar Produto
                    </h3>
                    <p className="text-green-100">
                      Adicionar um novo produto ao sistema
                    </p>
                  </div>
                  <div className="ml-auto transform group-hover:translate-x-1 transition-transform duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Novo botão de Listar Produtos */}
              <div
                onClick={() => navigateTo("listar")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-100 bg-opacity-20 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
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
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Ver Produtos</h3>
                    <p className="text-purple-100">
                      Visualizar todos os produtos cadastrados
                    </p>
                  </div>
                  <div className="ml-auto transform group-hover:translate-x-1 transition-transform duration-200">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Novo botão para Dashboard */}
              <div
                onClick={() => navigateTo("dashboard")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-100 bg-opacity-20 rounded-lg mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Dashboard</h3>
                    <p className="text-orange-100">
                      Ver estatísticas e análises
                    </p>
                  </div>
                  <div className="ml-auto transform group-hover:translate-x-1 transition-transform duration-200">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } p-4 relative`}
    >
      {/* Theme Toggle Button - Fixed position */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-200 shadow-lg z-50"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <AnimatePresence mode="wait">
        {activePage === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        ) : (
          <motion.div
            key="page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full mt-auto pt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 flex items-center">
                <div className="mr-3 bg-blue-600 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
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
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Products IA
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Products IA. Todos os direitos
                reservados a tififerreira@gmail.com.
              </div>
              {/* Social media icons removed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <ProdutosProvider>
            <MainContent />
          </ProdutosProvider>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
