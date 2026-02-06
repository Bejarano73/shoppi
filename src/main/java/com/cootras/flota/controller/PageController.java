package com.cootras.flota.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;

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
