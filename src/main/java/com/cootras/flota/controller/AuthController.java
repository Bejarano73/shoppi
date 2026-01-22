package com.cootras.flota.controller;

import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.time.Instant;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Map<String, String> USERS = new ConcurrentHashMap<>();
    private static final Map<String, OtpInfo> OTPS = new ConcurrentHashMap<>();

    static {
        USERS.put("admin@empresa.com", "admin123");
        USERS.put("demo@empresa.com", "demo123");
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta login(@RequestBody Map<String, Object> body, HttpSession session) {
        try {
            String email = asText(body.get("email"));
            String password = asText(body.get("password"));
            if (email == null || password == null) {
                return new Respuesta(false, "Email y contraseña son requeridos");
            }
            String stored = USERS.get(email);
            if (stored == null || !stored.equals(password)) {
                return new Respuesta(false, "Credenciales inválidas");
            }
            session.setAttribute("AUTH_EMAIL", email);
            return new Respuesta(true, "Inicio de sesión exitoso", Map.of("email", email));
        } catch (Exception e) {
            return new Respuesta(false, "Error en login: " + e.getMessage());
        }
    }

    @PostMapping(value = "/request-otp", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta requestOtp(@RequestBody Map<String, Object> body) {
        try {
            String email = asText(body.get("email"));
            if (email == null || email.isBlank()) {
                return new Respuesta(false, "Email es requerido");
            }
            String code = String.format("%06d", new Random().nextInt(1_000_000));
            Instant expires = Instant.now().plus(Duration.ofMinutes(5));
            OTPS.put(email, new OtpInfo(code, expires));
            return new Respuesta(true, "OTP enviado al correo", Map.of("expiresAt", expires.toString(), "devOtp", code));
        } catch (Exception e) {
            return new Respuesta(false, "Error generando OTP: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify-otp", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta verifyOtp(@RequestBody Map<String, Object> body, HttpSession session) {
        try {
            String email = asText(body.get("email"));
            String otp = asText(body.get("otp"));
            if (email == null || otp == null) {
                return new Respuesta(false, "Email y OTP son requeridos");
            }
            OtpInfo info = OTPS.get(email);
            if (info == null) {
                return new Respuesta(false, "No hay OTP solicitado para este correo");
            }
            if (Instant.now().isAfter(info.expiresAt())) {
                OTPS.remove(email);
                return new Respuesta(false, "OTP expirado");
            }
            if (!info.code().equals(otp)) {
                return new Respuesta(false, "OTP inválido");
            }
            OTPS.remove(email);
            session.setAttribute("AUTH_EMAIL", email);
            return new Respuesta(true, "Verificación exitosa", Map.of("email", email));
        } catch (Exception e) {
            return new Respuesta(false, "Error verificando OTP: " + e.getMessage());
        }
    }

    private static String asText(Object o) { return o == null ? null : String.valueOf(o); }

    private record OtpInfo(String code, Instant expiresAt) {}
}