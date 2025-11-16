package model;

/**
 * Classe de modelo que representa um item do catálogo.
 */
public class Item {
    private int id;
    private String titulo;
    private String autor;
    private int ano;
    private String genero;
    private String detalhes;

    
    public Item() {
    }

  
    public Item(int id, String titulo, String autor, int ano, String genero, String detalhes) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this.genero = genero;
        this.detalhes = detalhes;
    }

  
    public int getId() {
        return id;
    }

 
    public void setId(int id) {
        this.id = id;
    }

  
    public String getTitulo() {
        return titulo;
    }

 
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }


    public String getAutor() {
        return autor;
    }


    public void setAutor(String autor) {
        this.autor = autor;
    }

  
    public int getAno() {
        return ano;
    }


    public void setAno(int ano) {
        this.ano = ano;
    }


    public String getGenero() {
        return genero;
    }


    public void setGenero(String genero) {
        this.genero = genero;
    }


    public String getDetalhes() {
        return detalhes;
    }

   
    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }

  
    @Override
    public String toString() {
        return id + " - " + titulo + " (" + autor + ", " + ano + ") - " + genero;
    }
}
