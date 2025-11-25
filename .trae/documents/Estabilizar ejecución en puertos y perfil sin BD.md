## Contexto
- El servidor falla porque el puerto `5055` está ocupado; el plugin de Spring Boot detiene el arranque al no poder iniciar Tomcat.

## Acciones inmediatas (sin cambios de código)
- Ejecutar en puerto alterno: `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=5056` o `java -jar target/shoppi-0.0.1-SNAPSHOT.jar --server.port=5056`.
- Liberar 5055 cuando se requiera: `netstat -ano | findstr :5055` y `taskkill /PID <PID> /F`.
- También puedes usar variable de entorno: `set PORT=5056` y luego `mvn spring-boot:run`.

## Ajustes mínimos de configuration (propuestos)
- Añadir un perfil `dev5056` para desarrollo: `server.port=5056` y combinar con `no-db` al ejecutar (`SPRING_PROFILES_ACTIVE=no-db,dev5056`).
- Mantener la parametrización de puerto por variable (`PORT`) para dev/CI sin editar archivos.

## Verificación
- Abrir `http://localhost:5056/flota/inicio` (Hola mundo) y `http://localhost:5056/flota/vehiculos` (CRUD in-memory) tras levantar.
- Confirmar logs de arranque sin “Port already in use” y respuesta HTTP 200 en ambas rutas.

## Mejoras opcionales
- Agregar `spring-boot-starter-actuator` para `/actuator/health` y verificar estado rápidamente.
- Crear script de utilidad para Windows que libere el puerto antes de arrancar (opcional).

¿Confirmas que aplico el perfil/propiedades de dev y dejo el arranque por puerto 5056 por defecto en desarrollo?