package com.cootras.flota.controller;

import com.cootras.flota.dto.LoginDTO;
import io.Respuesta; // Tu clase profesional
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Brahyan_Bejarano
 */
@RestController("/api/auth")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<Respuesta<Map<String, Object>>> login(@RequestBody LoginDTO loginDto, HttpServletRequest request) {

        // No necesitamos try-catch. Si falla, el GlobalExceptionHandler
        // captura la excepción y devuelve tu objeto Respuesta con estado: false.
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getLogin(), loginDto.getPassword())
        );

        // Establecer contexto
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Manejo de Sesión
        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

        // Preparamos la salida (Data) de forma estructurada
        Map<String, Object> data = new HashMap<>();
        data.put("username", auth.getName());
        data.put("sessionId", session.getId());
        data.put("roles", auth.getAuthorities());

        // Retornamos usando tu método estático de éxito
        return ResponseEntity.ok(Respuesta.success("¡Bienvenido al sistema!", data));
    }
}
