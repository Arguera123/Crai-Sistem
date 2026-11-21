# Crai-Sistem

Sistema web del CRAI — Biblioteca P. Florentino Idoate S.J. (UCA) para la gestión de préstamos de computadoras (Learning Center), préstamos de casilleros, registro de ingresos (check-in), usuarios y cuentas WiFi.

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/INSTALACION.md](docs/INSTALACION.md) | Guía de instalación: desarrollo local, servidor con Docker, configuración de Microsoft, respaldos y solución de problemas. |
| [docs/API.md](docs/API.md) | Documentación técnica: arquitectura, instalación, variables de entorno, autenticación, y cada endpoint con parámetros, body, respuestas y errores. |
| [docs/MANUAL_USUARIO.md](docs/MANUAL_USUARIO.md) | Manual de usuario por rol, con indicaciones de dónde tomar cada captura de pantalla. |
| [docs/CORRECCIONES.md](docs/CORRECCIONES.md) | Fallas encontradas en la revisión, correcciones aplicadas y recomendaciones pendientes. |

## Estructura

```
craisistem-backend/    API REST (Node.js, Express 5, TypeORM, PostgreSQL)
craisistem-frontend/   Aplicación web (React 19, Vite, MUI) + configuración de Nginx
docker-compose.yml     Base de datos + backend + frontend
.env.template          Plantilla de variables de entorno
```

## Inicio rápido (Docker)

```bash
cp .env.template .env        # completar los valores (TOKEN_SECRET, ADMIN_EMAIL, DB_*, MICROSOFT_*, ...)
docker compose up -d --build
```

Guía completa (desarrollo local y producción): [docs/INSTALACION.md](docs/INSTALACION.md).
