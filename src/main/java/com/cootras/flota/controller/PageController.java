package com.cootras.flota.controller;

import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author Brahyan_Bejarano
 */
@Controller
public class PageController {

    // BLOQUEADO: No tiene anotación, por lo tanto requiere auth por defecto
    @GetMapping(value = "/dashboard", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return "pages/inicio";
    }

    // BLOQUEADO: Solo ADMIN podrá entrar (asumiendo que configuraste roles)
    @GetMapping(value = "/conductores", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public String conductores() {
        return "pages/conductores";
    }

    // ABIERTO: Cualquier persona puede ver la landing
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String presentacion() {
        return "pages/landing";
    }

    // ABIERTO: Necesario para que puedan loguearse
    @GetMapping(value = "/login", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String login() {
        return "pages/login";
    }

    @GetMapping(value = "/Dashboard", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String Dashboard() {
        return "pages/Dashboard";
    }

    @GetMapping(value = "/ZonaPago", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String ZonaPago() {
        return "pages/ZonaPago";
    }

    @GetMapping(value = "/Contactenos", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String Contactenos() {
        return "pages/Contactenos";
    }

    @GetMapping(value = "/TerminoCondiciones", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String TerminoCondiciones() {
        return "pages/TerminoCondiciones";
    }

    @GetMapping(value = "/Registro", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String Registro(@RequestParam(name = "step", required = false) String step, Model model) {
        List<String> pasosPermitidos = List.of("3", "5", "8", "10");

        // Si step no viene o no está permitido, redirigimos
        if (step == null || !pasosPermitidos.contains(step)) {
            return "redirect:/"; // o a otra página que quieras
        }

        // Si es un step válido, lo agregamos al modelo
        model.addAttribute("step", step);
        return "pages/Registro";
    }

    @GetMapping(value = "/Planes", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String planes(
            @RequestParam(name = "step", required = false) String step,
            Model model) {
        List<String> tiposPermitidos = List.of("empresa", "tienda");
        if (step == null || !tiposPermitidos.contains(step)) {
            return "redirect:/";
        }
        model.addAttribute("step", step);
        return "pages/Planes";
    }

    @GetMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("permitAll()")
    public String error() {
        return "pages/error";
    }

    // BLOQUEADO: Solo logueados
    @GetMapping(value = "/perfil", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("isAuthenticated()")
    public String perfil() {
        return "pages/perfil";
    }

    @GetMapping(value = "/formulariopago", produces = MediaType.TEXT_HTML_VALUE)
    @PreAuthorize("isAuthenticated()")
    public String formulariopago() {
        return "pages/formulariopago";
    }

    // NOTA: Todos los demás métodos que no tienen @PreAuthorize
    // quedarán bloqueados automáticamente por la configuración global.
}
