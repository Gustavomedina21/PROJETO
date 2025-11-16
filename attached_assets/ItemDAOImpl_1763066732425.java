package dao;

import model.Item;
import util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**

 */
public class ItemDAOImpl implements ItemDAO {

    /**

     */
    private Item mapRow(ResultSet rs) throws SQLException {
        return new Item(
            rs.getInt("id"),
            rs.getString("titulo"),
            rs.getString("autor"),
            rs.getInt("ano"),
            rs.getString("genero"),
            rs.getString("detalhes")
        );
    }

    /**
     * Insere um novo item no banco de dados.
     * Utiliza PreparedStatement para evitar SQL Injection.
     * O ID é gerado automaticamente pelo banco (SERIAL).
     */
    @Override
    public void inserir(Item item) throws Exception {
        String sql = "INSERT INTO items (titulo, autor, ano, genero, detalhes) VALUES (?, ?, ?, ?, ?)";
        
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            // Define os parâmetros do PreparedStatement na ordem correta
            pstmt.setString(1, item.getTitulo());
            pstmt.setString(2, item.getAutor());
            pstmt.setInt(3, item.getAno());
            pstmt.setString(4, item.getGenero());
            pstmt.setString(5, item.getDetalhes());
            
            pstmt.executeUpdate();
        }
    }

    /**
     * Lista todos os itens cadastrados no banco de dados.
     * Os resultados são ordenados por ID em ordem crescente.
     */
    @Override
    public List<Item> listarTodos() throws Exception {
        List<Item> items = new ArrayList<>();
        String sql = "SELECT * FROM items ORDER BY id";
        
        // Try-with-resources para gerenciamento automático de recursos
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            // Itera por todos os resultados e converte para objetos Item
            while (rs.next()) {
                items.add(mapRow(rs));
            }
        }
        
        return items;
    }

    /**
     * Busca itens por título ou autor usando correspondência parcial.
     * A busca é case-insensitive (não diferencia maiúsculas de minúsculas).
     * Utiliza o operador LIKE do SQL para encontrar correspondências parciais.
     */
    @Override
    public List<Item> buscarPorTituloOuAutor(String termo) throws Exception {
        List<Item> items = new ArrayList<>();
        String sql = "SELECT * FROM items WHERE LOWER(titulo) LIKE ? OR LOWER(autor) LIKE ? ORDER BY id";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            // Adiciona % antes e depois para busca parcial, converte para minúsculas
            String termoLike = "%" + termo.toLowerCase() + "%";
            pstmt.setString(1, termoLike);
            pstmt.setString(2, termoLike);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    items.add(mapRow(rs));
                }
            }
        }
        
        return items;
    }

    /**
     * Busca um item específico pelo seu ID único.
     * Retorna um Optional para indicar presença ou ausência do item.
     */
    @Override
    public Optional<Item> buscarPorId(int id) throws Exception {
        String sql = "SELECT * FROM items WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
            }
        }
        
        return Optional.empty();
    }

    /**
     * Atualiza campos específicos de um item existente.
     * Constrói dinamicamente a query SQL apenas com os campos fornecidos.
     * Apenas campos não nulos e não vazios são incluídos na atualização.
     */
    @Override
    public void atualizar(int id, String titulo, String autor, Integer ano, String genero, String detalhes) throws Exception {
        StringBuilder sql = new StringBuilder("UPDATE items SET ");
        List<Object> parametros = new ArrayList<>();
        boolean primeiro = true;
        
        // Constrói dinamicamente a query SQL apenas com campos fornecidos
        if (titulo != null && !titulo.isEmpty()) {
            sql.append("titulo = ?");
            parametros.add(titulo);
            primeiro = false;
        }
        if (autor != null && !autor.isEmpty()) {
            if (!primeiro) sql.append(", ");
            sql.append("autor = ?");
            parametros.add(autor);
            primeiro = false;
        }
        if (ano != null && ano > 0) {
            if (!primeiro) sql.append(", ");
            sql.append("ano = ?");
            parametros.add(ano);
            primeiro = false;
        }
        if (genero != null && !genero.isEmpty()) {
            if (!primeiro) sql.append(", ");
            sql.append("genero = ?");
            parametros.add(genero);
            primeiro = false;
        }
        if (detalhes != null && !detalhes.isEmpty()) {
            if (!primeiro) sql.append(", ");
            sql.append("detalhes = ?");
            parametros.add(detalhes);
        }
        
        // Valida que pelo menos um campo foi fornecido para atualização
        if (parametros.isEmpty()) {
            throw new Exception("Nenhum campo foi fornecido para atualização");
        }
        
        // Adiciona a cláusula WHERE para especificar qual item atualizar
        sql.append(" WHERE id = ?");
        parametros.add(id);
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            
            // Define os parâmetros dinamicamente na ordem em que foram adicionados
            for (int i = 0; i < parametros.size(); i++) {
                pstmt.setObject(i + 1, parametros.get(i));
            }
            
            pstmt.executeUpdate();
        }
    }

    /**
     * Remove um item do banco de dados pelo seu ID.
     * A operação é permanente e não pode ser desfeita.
     */
    @Override
    public void deletar(int id) throws Exception {
        String sql = "DELETE FROM items WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        }
    }
}
