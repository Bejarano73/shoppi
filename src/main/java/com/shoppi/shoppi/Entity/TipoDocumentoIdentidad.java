/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.shoppi.shoppi.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

/**
 *
 * @author Brahyan_Bejarano
 */
@Data
@Entity
@Table(name = "tipodocumentoidentidad")
public class TipoDocumentoIdentidad {

    @Id
    private Integer idtipodocumentoidentidad;

    @Column(nullable = false, length = 256)
    private String descripcion;

    @Column(nullable = false, length = 8)
    private String abreviatura;

    @Column(columnDefinition = "boolean default true")
    private Boolean personanatural = true;

    @Column(columnDefinition = "boolean default true")
    private Boolean residente = true;

    @Column(columnDefinition = "boolean default true")
    private Boolean visible = true;

}
