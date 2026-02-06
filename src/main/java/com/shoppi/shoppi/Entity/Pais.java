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
@Table(name = "pais")
public class Pais {

    @Id
    @Column(length = 8)
    private String idpais;

    @Column(nullable = false, length = 128)
    private String nombre;

    @Column(nullable = false, length = 8)
    private String abreviatura;

}
