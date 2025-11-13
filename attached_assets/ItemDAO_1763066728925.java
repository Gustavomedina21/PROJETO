package dao;

import model.Item;
import java.util.List;
import java.util.Optional;

/**
 * Interface DAO (Data Access Object) para operações com itens do catálogo.
 * Define o contrato para acesso e manipulação de dados no banco PostgreSQL.
 * Utiliza o padrão DAO para separar a lógica de negócio da lógica de acesso a dados.
 * 
 * @author Sistema de Catálogo
 * @version 1.0
 */
public interface ItemDAO {
    
    /**
     * Insere um novo item no banco de dados.
     * 
     * @param item Objeto Item contendo os dados a serem inseridos
     * @throws Exception Se ocorrer erro na conexão ou execução SQL
     */
    void inserir(Item item) throws Exception;
    
    /**
     * Lista todos os itens cadastrados no banco de dados.
     * Os itens são retornados ordenados por ID.
     * 
     * @return Lista contendo todos os itens cadastrados
     * @throws Exception Se ocorrer erro na conexão ou execução SQL
     */
    List<Item> listarTodos() throws Exception;
    
    /**
     * Busca itens por título ou autor usando pesquisa parcial (LIKE).
     * A busca não diferencia maiúsculas de minúsculas.
     * 
     * @param termo Termo de busca a ser procurado no título ou autor
     * @return Lista de itens que correspondem ao termo de busca
     * @throws Exception Se ocorrer erro na conexão ou execução SQL
     */
    List<Item> buscarPorTituloOuAutor(String termo) throws Exception;
    
    /**
     * Busca um item específico pelo seu ID.
     * 
     * @param id Identificador único do item
     * @return Optional contendo o item se encontrado, ou vazio se não existir
     * @throws Exception Se ocorrer erro na conexão ou execução SQL
     */
    Optional<Item> buscarPorId(int id) throws Exception;
    
    /**
     * Atualiza as informações de um item existente.
     * Apenas os campos não nulos/vazios serão atualizados.
     * 
     * @param id ID do item a ser atualizado
     * @param titulo Novo título (ou null para manter o atual)
     * @param autor Novo autor (ou null para manter o atual)
     * @param ano Novo ano (ou null para manter o atual)
     * @param genero Novo gênero (ou null para manter o atual)
     * @param detalhes Novos detalhes (ou null para manter os atuais)
     * @throws Exception Se nenhum campo for fornecido ou erro na execução SQL
     */
    void atualizar(int id, String titulo, String autor, Integer ano, String genero, String detalhes) throws Exception;
    
    /**
     * Remove um item do banco de dados pelo seu ID.
     * 
     * @param id Identificador único do item a ser deletado
     * @throws Exception Se ocorrer erro na conexão ou execução SQL
     */
    void deletar(int id) throws Exception;
}
