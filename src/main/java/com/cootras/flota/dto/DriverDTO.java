package com.cootras.flota.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDTO {
    private Long id;
    private String nombre;
    private String estado; // Activo/Inactivo
    private String email;
    private String telefono;
    private double rating;
    private long kilometros;
    private int viajes;
    // Extras para detalle
    private String licenciaNumero;
    private String licenciaCategoria;
    private String licenciaVencimiento; // ISO date string
    private String vehiculoAsignado;
    private String fechaContratacion; // ISO date string
    private String ultimaInspeccion; // ISO date string
}

