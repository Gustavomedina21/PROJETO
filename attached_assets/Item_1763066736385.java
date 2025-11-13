package model;

/**
 * Classe de modelo que representa um item do catálogo.
 * Esta classe encapsula informações sobre livros, filmes ou outros itens
 * que podem ser armazenados no banco de dados.
 * 
 * @author Sistema de Catálogo
 * @version 1.0
 */
public class Item {
    private int id;
    private String titulo;
    private String autor;
    private int ano;
    private String genero;
    private String detalhes;

    /**
     * Construtor padrão sem parâmetros.
     * Utilizado para criar instâncias vazias que serão preenchidas posteriormente.
     */
    public Item() {
    }

    /**
     * Construtor completo com todos os parâmetros.
     * 
     * @param id Identificador único do item (gerado automaticamente pelo banco)
     * @param titulo Título do item (livro, filme, etc.)
     * @param autor Autor ou criador do item
     * @param ano Ano de publicação ou lançamento
     * @param genero Gênero ou categoria do item
     * @param detalhes Informações adicionais sobre o item
     */
    public Item(int id, String titulo, String autor, int ano, String genero, String detalhes) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.detalhes = detalhes;
    }

    /**
     * Obtém o identificador único do item.
     * @return ID do item
     */
    public int getId() {
        return id;
    }

    /**
     * Define o identificador único do item.
     * @param id Novo ID do item
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Obtém o título do item.
     * @return Título do item
     */
    public String getTitulo() {
        return titulo;
    }

    /**
     * Define o título do item.
     * @param titulo Novo título do item
     */
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    /**
     * Obtém o autor ou criador do item.
     * @return Autor do item
     */
    public String getAutor() {
        return autor;
    }

    /**
     * Define o autor ou criador do item.
     * @param autor Novo autor do item
     */
    public void setAutor(String autor) {
        this.autor = autor;
    }

    /**
     * Obtém o ano de publicação ou lançamento.
     * @return Ano do item
     */
    public int getAno() {
        return ano;
    }

    /**
     * Define o ano de publicação ou lançamento.
     * @param ano Novo ano do item
     */
    public void setAno(int ano) {
        this.ano = ano;
    }

    /**
     * Obtém o gênero ou categoria do item.
     * @return Gênero do item
     */
    public String getGenero() {
        return genero;
    }

    /**
     * Define o gênero ou categoria do item.
     * @param genero Novo gênero do item
     */
    public void setGenero(String genero) {
        this.genero = genero;
    }

    /**
     * Obtém os detalhes adicionais do item.
     * @return Detalhes do item
     */
    public String getDetalhes() {
        return detalhes;
    }

    /**
     * Define os detalhes adicionais do item.
     * @param detalhes Novos detalhes do item
     */
    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }

    /**
     * Retorna uma representação em String do item formatada para exibição.
     * Formato: "ID - Título (Autor, Ano) - Gênero"
     * 
     * @return String formatada com as principais informações do item
     */
    @Override
    public String toString() {
        return id + " - " + titulo + " (" + autor + ", " + ano + ") - " + genero;
    }
}
