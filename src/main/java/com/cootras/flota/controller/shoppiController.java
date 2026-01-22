package com.cootras.flota.controller;

import com.cootras.flota.io.IRespuesta;
import com.cootras.flota.io.Respuesta;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

@RestController("flotaShoppiController")
@RequestMapping("/shoppi")
public class shoppiController {

    @ResponseBody
    @GetMapping("/obtener")
    public IRespuesta obtenerRuta(@RequestParam String origen, @RequestParam String destino) {
        try {

            // ==========================
            //   VALIDACIÓN DE PARÁMETROS
            // ==========================
            if (origen == null || origen.isBlank() || destino == null || destino.isBlank()) {
                return new Respuesta(false, "Debes enviar origen y destino.");
            }

            // ==========================
            //   LLAMADA A GOOGLE MAPS
            // ==========================
            String apiKey = "TU_API_KEY_AQUI";

            String url = "https://maps.googleapis.com/maps/api/directions/json?"
                    + "origin=" + URLEncoder.encode(origen, StandardCharsets.UTF_8)
                    + "&destination=" + URLEncoder.encode(destino, StandardCharsets.UTF_8)
                    + "&key=" + apiKey;

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());

            if (!json.getString("status").equals("OK")) {
                return new Respuesta(false, "Google rechazó la petición: " + json.getString("status"));
            }

            // ==========================
            //   PARSEO DE DATOS
            // ==========================
            JSONArray routes = json.getJSONArray("routes");
            JSONObject route = routes.getJSONObject(0);
            JSONObject leg = route.getJSONArray("legs").getJSONObject(0);

            String distancia = leg.getJSONObject("distance").getString("text");
            String duracion = leg.getJSONObject("duration").getString("text");
            String polyline = route.getJSONObject("overview_polyline").getString("points");

            // ==========================
            //   ARMAR DATA (COMO EN getUsuariosResumen)
            // ==========================
            Map<String, Object> data = new HashMap<>();
            data.put("distancia", distancia);
            data.put("duracion", duracion);
            data.put("polyline", polyline);

            return new Respuesta(true, "Ruta consultada correctamente", data);

        } catch (Exception e) {
            return new Respuesta(false, "Error obteniendo ruta: " + e.getMessage());
        }
    }
}
