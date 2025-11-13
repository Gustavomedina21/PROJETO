package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Classe utilitária para gerenciamento de conexões com o banco de dados PostgreSQL.
 * Converte automaticamente a URL de conexão do Replit (formato postgresql://)
 * para o formato JDBC (jdbc:postgresql://).
 * 
 * Utiliza o padrão Singleton implícito através de variável estática.
 * 
 * @author Sistema de Catálogo
 * @version 1.0
 */
public class DatabaseConnection {
    private static String JDBC_URL;

    /**
     * Bloco estático executado uma única vez quando a classe é carregada.
     * Lê a variável de ambiente DATABASE_URL e converte para formato JDBC.
     */
    static {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null) {
            JDBC_URL = convertToJdbcUrl(databaseUrl);
        }
    }

    /**
     * Converte uma URL de banco de dados do formato Replit/PostgreSQL padrão
     * para o formato JDBC específico do driver PostgreSQL.
     * 
     * Conversões realizadas:
     * - postgres:// → jdbc:postgresql://
     * - postgresql:// → jdbc:postgresql://
     * - Extrai credenciais (user/password) da URL e as converte em parâmetros
     * - Preserva host, porta, caminho do banco e query parameters
     * 
     * @param databaseUrl URL original do banco (ex: postgresql://user:pass@host:port/db)
     * @return URL convertida no formato JDBC (ex: jdbc:postgresql://host:port/db?user=...&password=...)
     */
    private static String convertToJdbcUrl(String databaseUrl) {
        // Se já está no formato JDBC, retorna sem modificação
        if (databaseUrl.startsWith("jdbc:")) {
            return databaseUrl;
        }
        
        try {
            // Normaliza postgres:// para postgresql://
            if (databaseUrl.startsWith("postgres://")) {
                databaseUrl = databaseUrl.replace("postgres://", "postgresql://");
            }
            
            if (databaseUrl.startsWith("postgresql://")) {
                // Analisa a URL usando java.net.URI
                java.net.URI uri = new java.net.URI(databaseUrl);
                String userInfo = uri.getUserInfo();
                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();
                
                String user = null;
                String password = null;
                
                // Extrai usuário e senha da parte userInfo (formato: user:password)
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    user = parts[0];
                    password = parts[1];
                }
                
                // Constrói a URL JDBC
                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
                jdbcUrl.append(host);
                if (port != -1) {
                    jdbcUrl.append(":").append(port);
                }
                if (path != null && !path.isEmpty()) {
                    jdbcUrl.append(path);
                }
                
                // Adiciona parâmetros de conexão (user, password, etc.)
                StringBuilder params = new StringBuilder();
                if (user != null) {
                    params.append("user=").append(user);
                }
                if (password != null) {
                    if (params.length() > 0) params.append("&");
                    params.append("password=").append(password);
                }
                if (query != null && !query.isEmpty()) {
                    if (params.length() > 0) params.append("&");
                    params.append(query);
                }
                
                if (params.length() > 0) {
                    jdbcUrl.append("?").append(params);
                }
                
                return jdbcUrl.toString();
            }
        } catch (Exception e) {
            System.err.println("Erro ao converter DATABASE_URL: " + e.getMessage());
        }
        
        // Se falhar na conversão, retorna a URL original
        return databaseUrl;
    }

    /**
     * Obtém uma nova conexão com o banco de dados PostgreSQL.
     * Cada chamada cria uma nova conexão usando DriverManager.
     * 
     * É responsabilidade do chamador fechar a conexão após o uso
     * (recomenda-se usar try-with-resources).
     * 
     * @return Nova conexão ativa com o banco de dados
     * @throws SQLException Se DATABASE_URL não estiver configurado ou houver erro de conexão
     */
    public static Connection getConnection() throws SQLException {
        if (JDBC_URL == null) {
            throw new SQLException("DATABASE_URL não configurado!");
        }
        return DriverManager.getConnection(JDBC_URL);
    }
}
