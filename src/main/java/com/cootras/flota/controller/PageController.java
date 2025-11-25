package com.cootras.flota.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.MediaType;

@Controller
public class PageController {

    @GetMapping(value = "/dashboard", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return "pages/inicio";
    }

    @GetMapping(value = "/conductores", produces = MediaType.TEXT_HTML_VALUE)
    public String conductores() {
        return "pages/conductores";
    }

    @GetMapping(value = "/documentos", produces = MediaType.TEXT_HTML_VALUE)
    public String documentos() {
        return "pages/documentos";
    }

    @GetMapping(value = "/solicitar-viaje", produces = MediaType.TEXT_HTML_VALUE)
    public String solicitarViaje() {
        return "pages/solicitar-viaje";
    }

    @GetMapping(value = "/crear-solicitud", produces = MediaType.TEXT_HTML_VALUE)
    public String crearSolicitud() {
        return "pages/crear-solicitud";
    }

    @GetMapping(value = "/peticiones", produces = MediaType.TEXT_HTML_VALUE)
    public String peticiones() {
        return "pages/peticiones";
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String presentacion() {
        return "pages/landing";
    }

    @GetMapping(value = "/flota", produces = MediaType.TEXT_HTML_VALUE)
    public String flota() {
        return "pages/flota";
    }

    @GetMapping(value = "/flota-detalle", produces = MediaType.TEXT_HTML_VALUE)
    public String flotaDetalle() {
        return "pages/flota-detalle";
    }

    @GetMapping(value = "/login", produces = MediaType.TEXT_HTML_VALUE)
    public String login() {
        return "pages/login";
    }
}
