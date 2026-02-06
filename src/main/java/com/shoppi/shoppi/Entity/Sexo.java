/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.shoppi.shoppi.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

/**
 *
 * @author Brahyan_Bejarano
 */
@Data
@Entity
@Table(name = "sexo")
public class Sexo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String idsexo;

    @Column(nullable = false, length = 32)
    private String descripcion;

    @Column(length = 8)
    private String abreviatura;

    @Column(columnDefinition = "boolean default true")
    private Boolean activo = true;

}
