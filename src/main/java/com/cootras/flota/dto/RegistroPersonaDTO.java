package com.cootras.flota.dto;

import Alertas.ExistsId; // Importas tu nueva anotación
import com.shoppi.shoppi.Entity.Ciudad;
import com.shoppi.shoppi.Entity.TipoDocumentoIdentidad;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * @author Brahyan_Bejarano
 */
@Data
public class RegistroPersonaDTO {

    @NotBlank(message = "La identificación es obligatoria")
    private String identificacion;

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un formato de email válido")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotNull(message = "La ciudad es obligatoria")
    @ExistsId(entity = Ciudad.class, message = "La ciudad seleccionada no existe en el sistema") // <--- AHORA SÍ VALIDA BD
    private Integer idciudad;

    @NotNull(message = "El tipo de documento es obligatorio")
    @ExistsId(entity = TipoDocumentoIdentidad.class, message = "El tipo de documento no es válido") // <--- AHORA SÍ VALIDA BD
    private Integer idtipodocumento;
}
