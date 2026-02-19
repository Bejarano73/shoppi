/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.cootras.flota.Service;

import com.cootras.flota.dto.RegistroPersonaDTO;
import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import com.shoppi.shoppi.Entity.Ciudad;
import com.shoppi.shoppi.Entity.Persona;
import com.shoppi.shoppi.Entity.TipoUsuario;
import com.shoppi.shoppi.Entity.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

/**
 *
 * @author Brahyan_Bejarano
 */
@Service
public class RegistrarPersona {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public IRespuesta registrarNuevoUsuario(RegistroPersonaDTO dto) {
        try {
            Persona persona = new Persona();
            persona.setIdentificacion(dto.getIdentificacion());
            persona.setNombres(dto.getNombres());
            persona.setApellidos(dto.getApellidos());
            persona.setEmailcontacto(dto.getEmail());
            persona.setTelefono(dto.getTelefono());
            persona.setDireccion("Dirección pendiente"); // Valor por defecto
            persona.getTipoDocumentoIdentidad().setIdtipodocumentoidentidad(22);
            persona.setCiudad(entityManager.find(Ciudad.class, dto.getIdciudad() != null ? dto.getIdciudad() : 1));
            entityManager.persist(persona);
            Usuario usuario = new Usuario();
            usuario.setPersona(persona); // @MapsId sincroniza los IDs automáticamente
            usuario.setLogin(dto.getEmail());
            usuario.setPassword(dto.getPassword());
            usuario.setTipoUsuario(entityManager.find(TipoUsuario.class, 2)); // 2 = Rol Conductor/Cliente
            usuario.setActivo(true);
            usuario.setFechavencimiento(LocalDate.now().plusYears(1));
            entityManager.persist(usuario);
            return new Respuesta(true, "Registro exitoso", usuario.getLogin());
        } catch (Exception e) {
            return new Respuesta(false, "Error: " + e.getMessage(), null);
        }
    }
}
