/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.cootras.flota.controller;

import com.cootras.flota.repository.CiudadResponsity;
import com.shoppi.shoppi.Entity.Ciudad;
import io.Respuesta;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Brahyan_Bejarano
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private CiudadResponsity ciudadRepo;

    @GetMapping("/ciudades")
    public Respuesta<List<Ciudad>> obtenerCiudades() {
        try {
            List<Ciudad> ciudades = ciudadRepo.findAll();
            // Usamos tu método estático profesional
            return Respuesta.success("Ciudades cargadas correctamente", ciudades);
        } catch (Exception e) {
            return Respuesta.error("Error al cargar ciudades: " + e.getMessage());
        }
    }
}
