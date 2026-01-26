package io;

/**
 * Interfaz que define los métodos para establecer el estado, mensaje y salida
 * de una respuesta.
 */
public interface IRespuesta {

    void setEstado(boolean estado);

    void setMensaje(String mensaje);

    void setSalida(Object salida);
}
