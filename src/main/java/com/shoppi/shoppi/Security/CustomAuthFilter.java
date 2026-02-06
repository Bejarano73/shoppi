package com.shoppi.shoppi.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/**
 * @author Brahyan_Bejarano
 */
public class CustomAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. Definimos qué dejamos pasar sin preguntar (recursos y login)
        boolean isPublicPath = path.equals("/login")
                || path.startsWith("/css")
                || path.startsWith("/api/auth")
                || path.startsWith("/js")
                || path.startsWith("/img")
                || path.equals("/");

        // 2. Si NO es público y NO está logueado, MATAMOS la petición aquí
        if (!isPublicPath && SecurityContextHolder.getContext().getAuthentication() == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Acceso denegado - Petición terminada\"}");
            response.getWriter().flush();
            return; // <--- AQUÍ muere la petición. No sigue al Controller ni a otros filtros.
        }

        filterChain.doFilter(request, response);
    }
}
