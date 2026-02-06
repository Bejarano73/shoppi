package io;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;

/**
 * @author Brahyan_Bejarano
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Respuesta<T> implements IRespuesta<T> {

    private boolean estado;
    private String mensaje;
    private T salida;
    private Date fecha;
    private String traceId; // Para seguimiento de errores pro

    public Respuesta() {
        this.fecha = new Date();
    }

    public Respuesta(boolean estado, String mensaje, T salida) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.salida = salida;
        this.fecha = new Date();
    }

    // Métodos Estáticos Profesionales
    public static <T> Respuesta<T> success(String mensaje, T salida) {
        return new Respuesta<>(true, mensaje, salida);
    }

    public static <T> Respuesta<T> success(String mensaje) {
        return new Respuesta<>(true, mensaje, null);
    }

    public static <T> Respuesta<T> error(String mensaje) {
        return new Respuesta<>(false, mensaje, null);
    }

    // Getters y Setters
    @Override
    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    @Override
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    @Override
    public void setSalida(T salida) {
        this.salida = salida;
    }

    public boolean getEstado() {
        return estado;
    }

    public String getMensaje() {
        return mensaje;
    }

    public T getSalida() {
        return salida;
    }

    public Date getFecha() {
        return fecha;
    }
}
