package com.shoppi.shoppi.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.method.HandlerMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import java.io.IOException;

public class CustomAuthFilter extends OncePerRequestFilter {

    private final RequestMappingHandlerMapping handlerMapping;

    public CustomAuthFilter(RequestMappingHandlerMapping handlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. Saltamos el filtro para recursos estáticos y el login básico
        if (path.startsWith("/css") || path.startsWith("/js") || path.startsWith("/img") || path.equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            HandlerExecutionChain handler = handlerMapping.getHandler(request);

            if (handler != null && handler.getHandler() instanceof HandlerMethod) {
                HandlerMethod method = (HandlerMethod) handler.getHandler();
                PreAuthorize preAuth = method.getMethodAnnotation(PreAuthorize.class);

                // Verificamos si tiene @PreAuthorize("permitAll()")
                boolean isPermitAll = preAuth != null && preAuth.value().contains("permitAll()");

                // Si NO es permitAll y el usuario NO está autenticado, bloqueamos.
                if (!isPermitAll && SecurityContextHolder.getContext().getAuthentication() == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Acceso denegado - Debes iniciar sesión\"}");
                    return; // Aquí termina la petición
                }
            }
        } catch (Exception e) {
            // Si hay un error técnico al mapear, dejamos que el flujo siga
            // para que Spring Security lo maneje con su configuración normal.
        }

        // 2. Si pasó las pruebas o es una ruta pública, sigue adelante
        filterChain.doFilter(request, response);
    }
}
