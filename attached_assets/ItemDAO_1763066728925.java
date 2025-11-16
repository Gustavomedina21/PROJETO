package dao;

import model.Item;
import java.util.List;
import java.util.Optional;

/**
 * Interface DAO (Data Access Object) para operações com itens do catálogo.
 * Define o contrato para acesso e manipulação de dados no banco PostgreSQL.
 * Utiliza o padrão DAO para separar a lógica de negócio da lógica de acesso a dados.

 */
public interface ItemDAO {
    
    /**
     * Insere um novo item no banco de dados.
     */
    void inserir(Item item) throws Exception;
    
    /**
     * Lista todos os itens cadastrados no banco de dados.
     * Os itens são retornados ordenados por ID.
     */
    List<Item> listarTodos() throws Exception;
    
    /**
     * Busca itens por título ou autor usando pesquisa parcial (LIKE).
     * A busca não diferencia maiúsculas de minúsculas.
     */
    List<Item> buscarPorTituloOuAutor(String termo) throws Exception;
    
    /**
     * Busca um item específico pelo seu ID.
     */
    Optional<Item> buscarPorId(int id) throws Exception;
    
    /**
     * Atualiza as informações de um item existente.
     * Apenas os campos não nulos/vazios serão atualizados.
     */
    void atualizar(int id, String titulo, String autor, Integer ano, String genero, String detalhes) throws Exception;
    
    /**
     * Remove um item do banco de dados pelo seu ID.
     */
    void deletar(int id) throws Exception;
}
