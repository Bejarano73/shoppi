/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.shoppi.shoppi.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 *
 * @author Brahyan_Bejarano
 */
@Data
@Entity
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idpersona;

    @ManyToOne
    @JoinColumn(name = "idtipodocumentoidentidad", nullable = false)
    private TipoDocumentoIdentidad tipoDocumentoIdentidad;

    @Column(nullable = false, length = 256)
    private String identificacion;

    @Column(nullable = false, length = 256)
    private String nombres;

    @Column(nullable = false, length = 256)
    private String apellidos;

    @ManyToOne
    @JoinColumn(name = "idsexo")
    private Sexo sexo;

    private LocalDate fechaexpedicion;

    @Column(length = 32)
    private Integer idciudadexpedicion;

    @Column(nullable = false, length = 256)
    private String emailcontacto;

    @Column(length = 256)
    private String emailentrega;

    @ManyToOne
    @JoinColumn(name = "idciudad", nullable = false)
    private Ciudad ciudad;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String direccion;

    @Column(length = 256)
    private String direccionenvio;

    @Column(nullable = false, length = 256)
    private String telefono = "";

    @Column(length = 256)
    private String celular;

    @Column(columnDefinition = "boolean default false")
    private Boolean grancontribuyente = false;

    @Column(columnDefinition = "boolean default false")
    private Boolean autoretenedor = false;

    @Column(length = 16)
    private String idtiporegimen = "0";

    @Column(length = 16)
    private String idactividadeconomica = "17";

    private Integer idtipopersona;

    private Integer digitoverificacion = -1;

    @Column(length = 256)
    private String nombrecomercial;

    @Column(length = 32)
    private String codigopostal;

    @Column(length = 32)
    private String idciudaddireccionfiscal;

    @Column(length = 256)
    private String direccionfiscal;

    @Column(length = 32)
    private String codigopostaldireccionfiscal;

    @Column(length = 256)
    private String matriculamercantil;

    @Column(columnDefinition = "boolean default false")
    private Boolean responsableiva = false;

    @Column(length = 128)
    private String profesion;

    @Column(length = 256)
    private String empresa;

    @Column(length = 128)
    private String cargo;

    @Column(length = 128)
    private String telefonooficina;

    @Column(length = 256)
    private String linkedin;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

}
