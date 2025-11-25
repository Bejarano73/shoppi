package com.shoppi.shoppi.controller;

import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shoppi")
public class ShoppiController {

    private static final Map<String, Map<String, Object>> PETICIONES = new ConcurrentHashMap<>();

    // Tu clave directa de Google Maps
    private static final String API_KEY = "AIzaSyAE1E7lO2bf_xZl3PP7MQu9gRYgd-UQIRg";

    @PostMapping(value = "/obtener", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta obtener(@RequestBody Map<String, Object> req, Principal principal) {
        try {
            String origen = asText(req.get("origen"));
            String destino = asText(req.get("destino"));
            String id = asText(req.get("id"));
            if (id == null || id.isBlank()) {
                id = "SV-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase();
            }

            String distanciaText = "—";
            String duracionText = "—";
            String kmText = "—";
            String polyline = "";

            if (origen != null && !origen.isBlank() && destino != null && !destino.isBlank()) {
                // URL de la Directions API clásica
                String url = String.format(
                        "https://maps.googleapis.com/maps/api/directions/json?origin=%s&destination=%s&key=%s&units=metric&language=es",
                        URLEncoder.encode(origen, StandardCharsets.UTF_8),
                        URLEncoder.encode(destino, StandardCharsets.UTF_8),
                        API_KEY
                );

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                JSONObject json = new JSONObject(response.body());
                JSONArray routes = json.optJSONArray("routes");

                if (routes != null && !routes.isEmpty()) {
                    JSONObject route = routes.getJSONObject(0);
                    JSONArray legs = route.optJSONArray("legs");
                    if (legs != null && !legs.isEmpty()) {
                        JSONObject leg = legs.getJSONObject(0);

                        // Distancia
                        distanciaText = leg.optJSONObject("distance").optString("text", "—");
                        kmText = distanciaText;

                        // Duración
                        duracionText = leg.optJSONObject("duration").optString("text", "—");

                        // Polyline
                        JSONObject poly = route.optJSONObject("overview_polyline");
                        if (poly != null) {
                            polyline = poly.optString("points", "");
                        }
                    }
                }
            }

            Map<String, Object> salida = new HashMap<>();
            salida.put("timestamp", Instant.now().toString());
            salida.put("actor", principal != null ? principal.getName() : null);
            salida.put("id", id);
            salida.put("distancia", distanciaText);
            salida.put("duracion", duracionText);
            salida.put("km", kmText);
            salida.put("polyline", polyline);
            salida.put("payload", req);
            // persist in-memory
            Map<String, Object> store = new HashMap<>();
            store.put("id", id);
            store.put("origen", origen);
            store.put("destino", destino);
            store.put("fecha", req.get("fecha"));
            store.put("hora", req.get("hora"));
            store.put("kilos", req.get("kilos"));
            store.put("carga", req.get("carga"));
            store.put("tipoVehiculo", req.get("tipoVehiculo"));
            store.put("distancia", distanciaText);
            store.put("duracion", duracionText);
            store.put("km", kmText);
            store.put("estado", req.getOrDefault("estado", "sin_asignacion"));
            store.put("watchersCount", req.getOrDefault("watchersCount", 0));
            store.put("createdAt", salida.get("timestamp"));
            PETICIONES.put(id, store);
            return new Respuesta(true, "Solicitud recibida", salida);
        } catch (Exception e) {
            return new Respuesta(false, "Error procesando solicitud: " + e.getMessage());
        }
    }

    @GetMapping(value = "/peticiones", produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta listar() {
        try {
            Map<String, Object> salida = new HashMap<>();
            salida.put("total", PETICIONES.size());
            long mirando = PETICIONES.values().stream().mapToLong(m -> {
                Object wc = m.get("watchersCount");
                if (wc instanceof Number) return ((Number) wc).longValue();
                try { return Long.parseLong(String.valueOf(wc)); } catch (Exception e) { return 0L; }
            }).sum();
            salida.put("mirando", mirando);
            salida.put("items", PETICIONES.values().stream().collect(Collectors.toList()));
            return new Respuesta(true, "Listado de peticiones", salida);
        } catch (Exception e) {
            return new Respuesta(false, "Error listando peticiones: " + e.getMessage());
        }
    }

    @PutMapping(value = "/peticiones/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta actualizar(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Map<String, Object> p = PETICIONES.get(id);
            if (p == null) return new Respuesta(false, "No existe la petición");
            if (body.containsKey("origen")) p.put("origen", body.get("origen"));
            if (body.containsKey("destino")) p.put("destino", body.get("destino"));
            if (body.containsKey("fecha")) p.put("fecha", body.get("fecha"));
            if (body.containsKey("hora")) p.put("hora", body.get("hora"));
            if (body.containsKey("kilos")) p.put("kilos", body.get("kilos"));
            if (body.containsKey("carga")) p.put("carga", body.get("carga"));
            if (body.containsKey("tipoVehiculo")) p.put("tipoVehiculo", body.get("tipoVehiculo"));
            if (body.containsKey("estado")) p.put("estado", body.get("estado"));
            if (body.containsKey("watchersCount")) p.put("watchersCount", body.get("watchersCount"));
            return new Respuesta(true, "Petición actualizada", p);
        } catch (Exception e) {
            return new Respuesta(false, "Error actualizando petición: " + e.getMessage());
        }
    }

    @DeleteMapping(value = "/peticiones/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public IRespuesta eliminar(@PathVariable String id) {
        try {
            Map<String, Object> p = PETICIONES.remove(id);
            if (p == null) return new Respuesta(false, "No existe la petición");
            return new Respuesta(true, "Petición eliminada", p);
        } catch (Exception e) {
            return new Respuesta(false, "Error eliminando petición: " + e.getMessage());
        }
    }

    private static String asText(Object o) { return o == null ? null : String.valueOf(o); }
}
