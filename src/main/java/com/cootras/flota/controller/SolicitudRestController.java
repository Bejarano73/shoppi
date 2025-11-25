package com.cootras.flota.controller;

import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudRestController {

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta crear(@RequestBody Map<String, Object> req) {
        try {
            Map<String, Object> data = new HashMap<>();
            String id = (String) req.getOrDefault("id", "SV-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase());
            data.put("id", id);
            data.put("createdAt", Instant.now().toString());
            data.put("payload", req);
            return new Respuesta(true, "Solicitud creada correctamente", data);
        } catch (Exception e) {
            return new Respuesta(false, "Error creando la solicitud: " + e.getMessage());
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta info() {
        return new Respuesta(false, "Endpoint disponible. Use POST para crear solicitud.");
    }
}
