package view;

import dao.ItemDAO;
import dao.ItemDAOImpl;
import model.Item;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Classe principal da aplicação de Catálogo com interface de linha de comando (CLI).
 * Apresenta um menu interativo para gerenciar itens no catálogo,
 * utilizando o padrão DAO para acesso aos dados.
 */
public class CatalogoApp {
    private static Scanner sc = new Scanner(System.in);
    private static ItemDAO itemDAO = new ItemDAOImpl();

    /**
     * Método principal que inicia a aplicação.
     * Verifica se a DATABASE_URL está configurada e exibe o menu interativo.
     */
    public static void main(String[] args) {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        // Valida se a variável de ambiente DATABASE_URL está configurada
        if (databaseUrl == null) {
            System.err.println("ERRO: DATABASE_URL não configurado!");
            return;
        }

        int opcao;
        // Loop principal do menu
        do {
            System.out.println("\n===== Catálogo com MySQL (DAO Pattern) =====");
            System.out.println("1 - Cadastrar item");
            System.out.println("2 - Listar itens");
            System.out.println("3 - Buscar por título/autor");
            System.out.println("4 - Atualizar item");
            System.out.println("5 - Deletar item");
            System.out.println("0 - Sair");
            System.out.print("Escolha: ");
            opcao = lerInt();

            switch (opcao) {
                case 1 -> cadastrarItem();
                case 2 -> listarItens();
                case 3 -> buscarItens();
                case 4 -> atualizarItem();
                case 5 -> deletarItem();
                case 0 -> System.out.println("Saindo...");
                default -> System.out.println("Opção inválida!");
            }
        } while (opcao != 0);
    }

    /**
     * Cadastra um novo item no catálogo.
     * Solicita ao usuário todas as informações necessárias (título, autor, ano, gênero, detalhes)
     * e salva no banco de dados através do DAO.
     */
    private static void cadastrarItem() {
        System.out.print("Título: ");
        String titulo = sc.nextLine();
        System.out.print("Autor: ");
        String autor = sc.nextLine();
        System.out.print("Ano: ");
        int ano = lerInt();
        System.out.print("Gênero: ");
        String genero = sc.nextLine();
        System.out.print("Detalhes: ");
        String detalhes = sc.nextLine();

       
        Item item = new Item(0, titulo, autor, ano, genero, detalhes);
        
        try {
            itemDAO.inserir(item);
            System.out.println("✅ Item cadastrado com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao cadastrar item: " + e.getMessage());
        }
    }

    /**
     * Lista todos os itens cadastrados no catálogo.
     * Busca todos os registros do banco de dados e exibe de forma formatada.
     * Se não houver itens, exibe mensagem informativa.
     */
    private static void listarItens() {
        System.out.println("\n=== Itens Cadastrados ===");
        
        try {
            List<Item> items = itemDAO.listarTodos();
            
            if (items.isEmpty()) {
                System.out.println("Nenhum item encontrado.");
            } else {
            
                items.forEach(System.out::println);
            }
        } catch (Exception e) {
            System.err.println("Erro ao listar itens: " + e.getMessage());
        }
    }

    /**
     * Busca itens no catálogo por título ou autor.
     * Realiza busca parcial case-insensitive e exibe os resultados encontrados.
     * Se não encontrar correspondências, exibe mensagem informativa.
     */
    private static void buscarItens() {
        System.out.print("Termo de busca (título/autor): ");
        String termo = sc.nextLine();

        try {
            List<Item> resultados = itemDAO.buscarPorTituloOuAutor(termo);
            
            System.out.println("\n=== Resultados da busca ===");
            if (resultados.isEmpty()) {
                System.out.println("Nenhum item encontrado.");
            } else {
                resultados.forEach(System.out::println);
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar itens: " + e.getMessage());
        }
    }

    /**
     * Atualiza as informações de um item existente.
     * Permite atualização parcial - apenas os campos fornecidos serão modificados.
     * Primeiro busca o item pelo ID, exibe informações atuais e solicita novos valores.
     * Campos deixados em branco ou zero mantêm os valores originais.
     */
    private static void atualizarItem() {
        System.out.print("ID do item a atualizar: ");
        int id = lerInt();
        
        try {
            Optional<Item> itemOpt = itemDAO.buscarPorId(id);
            
            // Verifica se o item existe
            if (itemOpt.isEmpty()) {
                System.out.println("Item com ID " + id + " não encontrado.");
                return;
            }
            
            // Exibe informações atuais do item
            Item item = itemOpt.get();
            System.out.println("Item atual: " + item.getTitulo() + " (" + item.getAutor() + ")");
            
            // Solicita novos valores (vazios = manter atual)
            System.out.print("Novo título (deixe em branco para manter): ");
            String titulo = sc.nextLine();
            System.out.print("Novo autor (deixe em branco para manter): ");
            String autor = sc.nextLine();
            System.out.print("Novo ano (0 para manter): ");
            int ano = lerInt();
            System.out.print("Novo gênero (deixe em branco para manter): ");
            String genero = sc.nextLine();
            System.out.print("Novos detalhes (deixe em branco para manter): ");
            String detalhes = sc.nextLine();

            // Converte valores vazios em null para não atualizar o campo
            itemDAO.atualizar(
                id, 
                titulo.isEmpty() ? null : titulo,
                autor.isEmpty() ? null : autor,
                ano == 0 ? null : ano,
                genero.isEmpty() ? null : genero,
                detalhes.isEmpty() ? null : detalhes
            );
            
            System.out.println("✅ Item atualizado com sucesso!");
            
        } catch (Exception e) {
            if (e.getMessage().contains("Nenhum campo")) {
                System.out.println(e.getMessage());
            } else {
                System.err.println("Erro ao atualizar item: " + e.getMessage());
            }
        }
    }

    /**
     * Deleta um item do catálogo após confirmação do usuário.
     * Primeiro busca e exibe o item pelo ID, depois solicita confirmação
     * antes de realizar a exclusão permanente do banco de dados.
     */
    private static void deletarItem() {
        System.out.print("ID do item a deletar: ");
        int id = lerInt();
        
        try {
            Optional<Item> itemOpt = itemDAO.buscarPorId(id);
            
            // Verifica se o item existe
            if (itemOpt.isEmpty()) {
                System.out.println("Item com ID " + id + " não encontrado.");
                return;
            }
            
            // Exibe item a ser deletado e solicita confirmação
            Item item = itemOpt.get();
            System.out.println("Item a deletar: " + item.getTitulo() + " (" + item.getAutor() + ")");
            System.out.print("Confirma a exclusão? (S/N): ");
            String confirmacao = sc.nextLine();
            
            // Valida confirmação do usuário
            if (!confirmacao.equalsIgnoreCase("S")) {
                System.out.println("Exclusão cancelada.");
                return;
            }
            
            itemDAO.deletar(id);
            System.out.println("✅ Item deletado com sucesso!");
            
        } catch (Exception e) {
            System.err.println("Erro ao deletar item: " + e.getMessage());
        }
    }

    /**
     * Método auxiliar para ler números inteiros do console com validação.
     * Continua solicitando entrada até receber um número válido.
     * Trata exceções de formatação automaticamente.
     */
    private static int lerInt() {
        while (true) {
            try {
                int valor = Integer.parseInt(sc.nextLine());
                return valor;
            } catch (NumberFormatException e) {
            
                System.out.print("Digite um número válido: ");
            }
        }
    }
}
