package io;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;
import java.util.Objects;

/**
 * Representa una respuesta estructurada con estado, mensaje, salida y fecha. La
 * clase es flexible, permitiendo valores vacíos o nulos en campos no
 * obligatorios y estableciendo valores por defecto cuando es necesario.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Respuesta implements IRespuesta {

    private boolean estado;
    private String mensaje;
    private Object salida;
    private Date fecha;

    // Flags de campos opcionales
    private boolean msgObligatorio = false;
    private boolean salidaObligatoria = false;

    /**
     * Constructor que inicializa todos los parámetros de la respuesta, pero si
     * los campos no se proporcionan, simplemente se dejan vacíos o nulos,
     * dependiendo de si son opcionales o obligatorios.
     *
     * @param estado Estado de la respuesta.
     * @param mensaje Mensaje asociado a la respuesta.
     * @param salida Los datos de salida de la respuesta.
     */
    public Respuesta(boolean estado, String mensaje, Object salida) {
        this.estado = estado;
        // Si el mensaje es vacío o nulo, solo lo asignamos si es obligatorio
        this.mensaje = (mensaje != null && !mensaje.trim().isEmpty()) ? mensaje : (msgObligatorio ? "Mensaje requerido" : "");
        this.salida = (salida != null) ? salida : (salidaObligatoria ? "Salida requerida" : null);
        this.fecha = new Date();
    }

    /**
     * Constructor que solo inicializa estado y mensaje, dejando salida como
     * null. Si mensaje es obligatorio y está vacío, se asigna un valor por
     * defecto.
     */
    public Respuesta(boolean estado, String mensaje) {
        this(estado, mensaje, null);
    }

    /**
     * Constructor que inicializa mensaje y salida, con estado por defecto como
     * true.
     */
    public Respuesta(String mensaje, Object salida) {
        this(true, mensaje, salida);
    }

    /**
     * Constructor que inicializa solo el mensaje, con estado por defecto como
     * true y salida como null. Si mensaje es obligatorio y está vacío, se
     * asigna un valor por defecto.
     */
    public Respuesta(String mensaje) {
        this(true, mensaje, null);
    }

    /**
     * Constructor que inicializa solo la salida, con estado por defecto como
     * true y mensaje vacío.
     */
    public Respuesta(Object salida) {
        this(true, "", salida);
    }

    /**
     * Constructor por defecto que inicializa con un mensaje vacío y salida
     * null.
     */
    public Respuesta() {
        this(true, "", null);
    }

    /**
     * Método para configurar si el mensaje es obligatorio. Si se establece como
     * obligatorio, se lanzará una advertencia si el mensaje está vacío.
     */
    public void setMensajeObligatorio(boolean obligatorio) {
        this.msgObligatorio = obligatorio;
    }

    /**
     * Método para configurar si la salida es obligatoria. Si se establece como
     * obligatorio, se lanzará una advertencia si la salida está vacía.
     */
    public void setSalidaObligatoria(boolean obligatorio) {
        this.salidaObligatoria = obligatorio;
    }

    /**
     * Método para verificar y asignar el valor de un campo obligatorio. Si el
     * campo es obligatorio y está vacío o nulo, se asignará un valor por
     * defecto.
     */
    private String verificarMensaje(String mensaje) {
        if (msgObligatorio && (mensaje == null || mensaje.trim().isEmpty())) {
            return "Mensaje requerido";
        }
        return mensaje != null ? mensaje : "";
    }

    private Object verificarSalida(Object salida) {
        return salidaObligatoria && salida == null ? "Salida requerida" : salida;
    }

    // Métodos de la interfaz IRespuesta
    @Override
    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    @Override
    public void setMensaje(String mensaje) {
        this.mensaje = verificarMensaje(mensaje);
    }

    @Override
    public void setSalida(Object salida) {
        this.salida = verificarSalida(salida);
    }

    // Métodos getter
    public boolean getEstado() {
        return estado;
    }

    public String getMensaje() {
        return mensaje != null ? mensaje : "";
    }

    public Object getSalida() {
        return salida != null ? salida : "Salida no proporcionada";
    }

    public Date getFecha() {
        return fecha;
    }
}
