import { createContext, useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx"; // Adicionar esta importação

export const ProdutosContext = createContext();

const validarProduto = (produto) => {
  const erros = [];
  if (!produto.codigo?.trim()) erros.push("Código é obrigatório");
  if (!produto.descricao?.trim()) erros.push("Descrição é obrigatória");
  if (
    !Array.isArray(produto.palavrasChave) ||
    produto.palavrasChave.length === 0
  ) {
    erros.push("Pelo menos uma palavra-chave é obrigatória");
  }
  return erros;
};

export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega produtos do localStorage
  useEffect(() => {
    try {
      const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
      setProdutos(produtosSalvos);
    } catch (err) {
      setError("Erro ao carregar produtos: " + err.message);
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva produtos no localStorage
  const salvarProdutos = useCallback((novosProdutos) => {
    try {
      localStorage.setItem("produtos", JSON.stringify(novosProdutos));
    } catch (err) {
      setError("Erro ao salvar produtos: " + err.message);
      console.error("Erro ao salvar produtos:", err);
      throw err;
    }
  }, []);

  // Adiciona novo produto
  const adicionarProduto = useCallback(
    (novoProduto) => {
      const errosValidacao = validarProduto(novoProduto);
      if (errosValidacao.length > 0) {
        throw new Error("Erros de validação: " + errosValidacao.join(", "));
      }

      // Verifica se o código já existe
      if (produtos.some((p) => p.codigo === novoProduto.codigo)) {
        throw new Error("Já existe um produto com este código");
      }

      try {
        const novaLista = [
          ...produtos,
          {
            ...novoProduto,
            dataCriacao: new Date().toISOString(),
            palavrasChave: novoProduto.palavrasChave.map((p) =>
              p.trim().toLowerCase()
            ),
          },
        ];
        setProdutos(novaLista);
        salvarProdutos(novaLista);
        return true;
      } catch (err) {
        setError("Erro ao adicionar produto: " + err.message);
        console.error("Erro ao adicionar produto:", err);
        throw err;
      }
    },
    [produtos, salvarProdutos]
  );

  // Remove produto
  const removerProduto = useCallback(
    (codigo) => {
      try {
        const novaLista = produtos.filter((p) => p.codigo !== codigo);
        setProdutos(novaLista);
        salvarProdutos(novaLista);
        return true;
      } catch (err) {
        setError("Erro ao remover produto: " + err.message);
        console.error("Erro ao remover produto:", err);
        throw err;
      }
    },
    [produtos, salvarProdutos]
  );

  // Atualiza produto
  const atualizarProduto = useCallback(
    (codigo, dadosAtualizados) => {
      try {
        const errosValidacao = validarProduto(dadosAtualizados);
        if (errosValidacao.length > 0) {
          throw new Error("Erros de validação: " + errosValidacao.join(", "));
        }

        const novaLista = produtos.map((p) =>
          p.codigo === codigo
            ? {
                ...p,
                ...dadosAtualizados,
                dataAtualizacao: new Date().toISOString(),
                palavrasChave: dadosAtualizados.palavrasChave.map((p) =>
                  p.trim().toLowerCase()
                ),
                imagem: dadosAtualizados.imagem || p.imagem, // Preserve existing image if no new one
              }
            : p
        );

        setProdutos(novaLista);
        salvarProdutos(novaLista);
        return true;
      } catch (err) {
        setError("Erro ao atualizar produto: " + err.message);
        console.error("Erro ao atualizar produto:", err);
        throw err;
      }
    },
    [produtos, salvarProdutos]
  );

  // Função auxiliar para normalizar e separar palavras
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[\s,-]+/) // Separa por espaço, hífen ou vírgula
      .filter((palavra) => palavra.length > 2); // Ignora palavras muito curtas
  };

  // Busca produto por similaridade
  const buscarProdutosPorSimilaridade = useCallback(
    (descricao, limiarSimilaridade = 0.2) => {
      try {
        const palavrasConsulta = normalizarTexto(descricao);

        return produtos
          .map((produto) => {
            // Combina e normaliza todas as palavras do produto
            const palavrasProduto = [
              ...normalizarTexto(produto.descricao),
              ...produto.palavrasChave.flatMap((pc) => normalizarTexto(pc)),
            ];

            // Calcula pontuação para correspondências exatas e parciais
            let pontuacao = 0;
            palavrasConsulta.forEach((palavraConsulta) => {
              // Verifica correspondência exata
              if (palavrasProduto.includes(palavraConsulta)) {
                pontuacao += 1;
              } else {
                // Verifica correspondência parcial
                const temCorrespondenciaParcial = palavrasProduto.some(
                  (palavraProduto) =>
                    palavraProduto.includes(palavraConsulta) ||
                    palavraConsulta.includes(palavraProduto)
                );
                if (temCorrespondenciaParcial) {
                  pontuacao += 0.5;
                }
              }
            });

            const similaridade = pontuacao / palavrasConsulta.length;

            return {
              produto,
              similaridade,
            };
          })
          .filter((item) => item.similaridade >= limiarSimilaridade)
          .sort((a, b) => b.similaridade - a.similaridade)
          .map((item) => ({
            ...item.produto,
            relevancia: Math.round(item.similaridade * 100),
          }));
      } catch (err) {
        setError("Erro ao buscar produtos: " + err.message);
        console.error("Erro ao buscar produtos:", err);
        throw err;
      }
    },
    [produtos]
  );

  const deletarProduto = useCallback(
    (codigo) => {
      try {
        const novosProdutos = produtos.filter(
          (produto) => produto.codigo !== codigo
        );
        setProdutos(novosProdutos);
        localStorage.setItem("produtos", JSON.stringify(novosProdutos));
      } catch (err) {
        setError("Erro ao deletar produto: " + err.message);
        console.error("Erro ao deletar produto:", err);
        throw err;
      }
    },
    [produtos]
  );

  // Função para exportar dados
  const exportarProdutos = useCallback(
    (formato) => {
      try {
        if (formato === "pdf") {
          const doc = new jsPDF();

          // Configurações de estilo
          const corPrimaria = [41, 128, 185];
          const corSecundaria = [44, 62, 80];
          const corLinhaAlternada = [240, 240, 240];
          let linhaAtual = 0; // Contador para alternar cores

          // Configurações de página
          const margemEsquerda = 15;
          const larguraUtil = doc.internal.pageSize.width - 2 * margemEsquerda;
          const alturaLinha = 8;

          // Cabeçalho principal
          doc.setFillColor(...corPrimaria);
          doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(24);
          doc.text(
            "Relatório de Produtos",
            doc.internal.pageSize.width / 2,
            25,
            { align: "center" }
          );

          doc.setFontSize(10);
          doc.text(
            `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
            margemEsquerda,
            35
          );

          // Função para desenhar cabeçalho da tabela
          const desenharCabecalhoTabela = (yPos) => {
            doc.setFillColor(...corSecundaria);
            doc.rect(margemEsquerda, yPos, larguraUtil, alturaLinha, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.text("Código", margemEsquerda + 5, yPos + 6);
            doc.text("Descrição", margemEsquerda + 45, yPos + 6);
            doc.text("Palavras-chave", margemEsquerda + 120, yPos + 6);
          };

          // Iniciar listagem de produtos
          let yPos = 50;
          desenharCabecalhoTabela(yPos);
          yPos += alturaLinha + 2;

          // Listar produtos
          produtos.forEach((produto) => {
            const descricaoLines = doc.splitTextToSize(produto.descricao, 70);
            const palavrasChave = doc.splitTextToSize(
              produto.palavrasChave.join(", "),
              60
            );
            const alturaItem =
              Math.max(descricaoLines.length, palavrasChave.length) * 7;

            // Verificar se precisa de nova página
            if (yPos + alturaItem > doc.internal.pageSize.height - 20) {
              doc.addPage();
              yPos = 20;
              desenharCabecalhoTabela(yPos);
              yPos += alturaLinha + 2;
              linhaAtual = 0; // Resetar contador ao mudar de página
            }

            // Alternar cores das linhas
            if (linhaAtual % 2 === 0) {
              doc.setFillColor(...corLinhaAlternada);
              doc.rect(
                margemEsquerda,
                yPos - 2,
                larguraUtil,
                alturaItem + 4,
                "F"
              );
            }

            // Conteúdo
            doc.setTextColor(...corSecundaria);
            doc.setFontSize(10);
            doc.text(produto.codigo, margemEsquerda + 5, yPos + 5);
            doc.text(descricaoLines, margemEsquerda + 45, yPos + 5);
            doc.text(palavrasChave, margemEsquerda + 120, yPos + 5);

            // Linha separadora
            doc.setDrawColor(200, 200, 200);
            doc.line(
              margemEsquerda,
              yPos + alturaItem + 2,
              margemEsquerda + larguraUtil,
              yPos + alturaItem + 2
            );

            yPos += alturaItem + 6;
            linhaAtual++; // Incrementar contador após cada linha
          });

          doc.save(`produtos_${new Date().toISOString().split("T")[0]}.pdf`);
        } else if (formato === "excel") {
          const dadosExcel = produtos.map((p) => ({
            Código: p.codigo,
            Descrição: p.descricao,
            "Palavras-chave": p.palavrasChave.join(", "),
            "Data de Criação": new Date(p.dataCriacao).toLocaleString("pt-BR"),
            "Última Atualização": p.dataAtualizacao
              ? new Date(p.dataAtualizacao).toLocaleString("pt-BR")
              : "-",
            "Quantidade de Palavras-chave": p.palavrasChave.length,
          }));

          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(dadosExcel);

          // Estilização do Excel
          const range = XLSX.utils.decode_range(worksheet["!ref"]);

          // Estilos para células
          const headerStyle = {
            fill: { fgColor: { rgb: "2980B9" } }, // Azul
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center" },
          };

          const alternateRowStyle = {
            fill: { fgColor: { rgb: "F0F0F0" } }, // Cinza claro
          };

          // Aplicar estilos
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
            worksheet[headerCell].s = headerStyle;
          }

          // Larguras das colunas
          worksheet["!cols"] = [
            { wch: 15 }, // Código
            { wch: 40 }, // Descrição
            { wch: 30 }, // Palavras-chave
            { wch: 20 }, // Data de Criação
            { wch: 20 }, // Última Atualização
            { wch: 15 }, // Quantidade
          ];

          XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
          XLSX.writeFile(
            workbook,
            `produtos_${new Date().toISOString().split("T")[0]}.xlsx`
          );
        }
      } catch (err) {
        setError("Erro ao exportar produtos: " + err.message);
        console.error("Erro ao exportar produtos:", err);
        throw err;
      }
    },
    [produtos]
  );

  const value = {
    produtos,
    loading,
    error,
    adicionarProduto,
    removerProduto,
    atualizarProduto,
    buscarProdutosPorSimilaridade,
    deletarProduto,
    exportarProdutos,
    limparErro: () => setError(null),
  };

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  );
};
