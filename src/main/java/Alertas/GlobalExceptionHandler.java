/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Alertas;

import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 *
 * @author Brahyan_Bejarano
 */
/**
 * @author Brahyan_Bejarano
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public IRespuesta manejarErroresValidacion(MethodArgumentNotValidException ex) {
        // Recolectamos todos los mensajes de error separados por comas
        String mensaje = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(java.util.stream.Collectors.joining(", "));

        return new Respuesta(false, "Errores de validación: " + mensaje, null);
    }

    // TIP EXTRA: También es bueno capturar errores de JSON mal formado
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public IRespuesta manejarErrorJson(HttpMessageNotReadableException ex) {
        return new Respuesta(false, "Error en el formato del JSON enviado", null);
    }
}
