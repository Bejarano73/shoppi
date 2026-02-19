/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.cootras.flota.controller;

import com.cootras.flota.Service.RegistrarPersona;
import com.cootras.flota.dto.RegistroPersonaDTO;
import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Brahyan_Bejarano
 */
@RestController
@RequestMapping("/persona")
public class PersonaController {

    @Autowired
    private RegistrarPersona registrarPersonaService; // Inyectar el servicio

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectar el encriptador

    @PostMapping("/registrar")
    @PreAuthorize("permitAll()")
    public IRespuesta registrar(@Valid @RequestBody RegistroPersonaDTO dto) {
        try {
            // ENCRIPTACIÓN SENCILLA: Antes de pasar al servicio
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));

            // Llamada a la instancia inyectada (no estática)
            return registrarPersonaService.registrarNuevoUsuario(dto);
        } catch (Exception e) {
            return new Respuesta(false, "Error al registrar: " + e.getMessage(), null);
        }
    }
}
