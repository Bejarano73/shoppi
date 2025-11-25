package io;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Respuesta implements IRespuesta {

    public boolean estado;
    public String mensaje;
    public Object salida;
    public Date fecha;

    public Respuesta(boolean estado, String mensaje, Object salida) {
        this.estado = estado;
        this.mensaje = mensaje != null ? mensaje : "";
        this.salida = salida; // No forzar new Object()
        this.fecha = new Date();
    }

    public Respuesta(boolean estado, String mensaje) {
        this(estado, mensaje, null);
    }

    public Respuesta(String mensaje, Object salida) {
        this(true, mensaje, salida);
    }

    public Respuesta(String mensaje) {
        this(true, mensaje, null);
    }

    public Respuesta(Object salida) {
        this(true, "", salida);
    }

    public Respuesta() {
        this(null);
    }

    @Override
    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    @Override
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    @Override
    public void setSalida(Object salida) {
        this.salida = salida;
    }
}
