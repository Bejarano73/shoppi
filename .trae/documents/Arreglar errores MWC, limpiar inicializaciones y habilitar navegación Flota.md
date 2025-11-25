## Diagnóstico rápido
- Error CustomElementRegistry (mwc-list-item): se está registrando dos veces el componente por carga duplicada de módulos MWC.
- app.initDateInputs no es función: el método fue removido pero sigue siendo invocado desde cootras.js en varios flujos (init y htmx:afterSwap), deteniendo la ejecución y rompiendo navegación.
- Flota no abre: el error anterior interrumpe HTMX; además asegurar rutas y script por página.
- Inputs MWC sin estilo: al fallar el registro de MWC por el error anterior, los custom elements quedan sin inicializar.
- Favicon 404 del túnel: solicitud hacia el host del túnel, no afecta funcionalidad.

## Plan de correcciones
### 1) Unificar carga de MWC sin duplicados
- En `layouts/main.html`:
  - Eliminar el `<script type="module" src="@material/mwc-list/mwc-list-item">` (mwc-select ya importa sus dependencias).
  - Mantener solo `mwc-textfield`, `mwc-textarea` y `mwc-select` con la misma versión y CDN (unpkg) para evitar re-registros.
- Verificar que ninguna página incluya módulos MWC adicionales.

### 2) Quitar invocaciones a funciones de fecha eliminadas
- En `static/js/cootras.js`:
  - Remover todas las llamadas a `app.initDateInputs()` y `app.initMaterialDateInputs()` en:
    - bloque de `htmx:afterSwap`.
    - método `navigate()` finally.
    - inicialización `app.init()`.
- Confirmar que no queden referencias a esas funciones.

### 3) Scripts por página (evitar doble carga)
- Mantener sólo `cootras.js` en el layout.
- Asegurar que cada página incluya su propio script:
  - `pages/solicitar-viaje.html` → `solicitar-viaje.js`.
  - `pages/crear-solicitud.html` → `crear-solicitud.js`.
  - `pages/flota.html` y `pages/flota-detalle.html` → `flota.js`.

### 4) Navegación Flota
- Sidebar: confirmar enlace HTMX a `/flota` (ya agregado).
- Controlador: confirmar rutas Thymeleaf:
  - `GET /flota` → `pages/flota`.
  - `GET /flota-detalle` → `pages/flota-detalle`.
- En `flota.js`: 
  - Delegar clic en `.fl-ver` con HTMX si está presente; fallback a `location.href`.

### 5) Filtros y estilo MWC
- Verificar que los filtros de “Crear Solicitud” e “Flota” usan `mwc-textfield` y `mwc-select` y que el filtrado lee:
  - `.value` del `mwc-select` o el `mwc-list-item[selected]`.
- Mantener `--mdc-theme-primary` en `cootras.css` y ancho 100% para inputs.

### 6) Favicon
- Añadir `<link rel="icon" href="/img/favicon.ico">` en `layouts/main.html` para evitar 404 en túneles.

## Verificación
- Recargar: consola sin `NotSupportedError` ni `initDateInputs`.
- Navegar a “Flota”: lista visible, botón “Ver” abre detalle.
- “Crear Solicitud”: filtros a la izquierda con estilo MWC, estado filtra correctamente y scrollX activo.
- “Solicitar Viaje”: sin intentos de inicializar calendarios.

¿Confirmo y aplico estos cambios ahora?