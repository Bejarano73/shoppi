/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */package com.shoppi.shoppi.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 *
 * @author Brahyan_Bejarano
 */
@Data
@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer idpersona;

    @OneToOne
    @MapsId
    @JoinColumn(name = "idpersona")
    public Persona persona;

    @ManyToOne
    @JoinColumn(name = "idtipousuario", nullable = false)
    public TipoUsuario tipoUsuario;

    @Column(nullable = false, length = 64)
    public String login;

    @Column(nullable = false, length = 256)
    public String password;

    @Column(nullable = false, columnDefinition = "boolean default false")
    public Boolean cambiar = false;

    @Column(nullable = false, columnDefinition = "boolean default true")
    public Boolean activo = true;

    @Column(name = "fechavencimiento", columnDefinition = "date default CURRENT_DATE")
    public LocalDate fechavencimiento = LocalDate.now();

    @Column(name = "intentosfallidos", columnDefinition = "int4 default 0")
    public Integer intentosfallidos = 0;

    @Column(length = 256, columnDefinition = "varchar(256) default ''")
    public String otp = "";

    // --- MÉTODOS DE SPRING SECURITY ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Usamos el nombre del tipo de usuario como Rol
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipoUsuario.getDescripcion()));
    }

    @Override
    public String getUsername() {
        return this.login; // Tu campo 'login' es el username para Spring
    }

    @Override
    public boolean isAccountNonExpired() {
        return !LocalDate.now().isAfter(fechavencimiento);
    }

    @Override
    public boolean isAccountNonLocked() {
        return intentosfallidos < 5; // Bloqueo tras 5 intentos (Lógica pro)
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !cambiar; // Si 'cambiar' es true, las credenciales "expiraron"
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }
}
