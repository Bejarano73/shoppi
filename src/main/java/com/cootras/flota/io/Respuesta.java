package com.cootras.flota.io;

public class Respuesta implements IRespuesta {
    private final boolean estado;
    private final String mensaje;
    private final Object salida;

    public Respuesta(boolean estado, String mensaje) {
        this(estado, mensaje, null);
    }

    public Respuesta(boolean estado, String mensaje, Object salida) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.salida = salida;
    }

    @Override
    public boolean isEstado() { return estado; }

    @Override
    public String getMensaje() { return mensaje; }

    @Override
    public Object getSalida() { return salida; }
}

