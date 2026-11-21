# Documentación técnica de la API — CRAI Sistem

Sistema de gestión del CRAI de la Biblioteca P. Florentino Idoate S.J. (UCA): préstamo de computadoras (Learning Center), préstamo de casilleros (lockers), registro de ingresos (check-in), administración de usuarios y de cuentas WiFi.

> Todas las respuestas de ejemplo de este documento se obtuvieron ejecutando la API real contra una base de datos PostgreSQL de prueba.

---

## Índice

1. [Arquitectura](#1-arquitectura)
2. [Instalación y ejecución](#2-instalación-y-ejecución)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Convenciones generales de la API](#4-convenciones-generales-de-la-api)
5. [Autenticación y roles](#5-autenticación-y-roles)
6. [Formato de errores](#6-formato-de-errores)
7. [Paginación](#7-paginación)
8. [Endpoints](#8-endpoints)
   - [8.1 Auth](#81-auth--apiv1auth)
   - [8.2 Usuarios](#82-usuarios--apiv1user)
   - [8.3 Computadoras](#83-computadoras--apiv1device)
   - [8.4 Préstamos de computadoras](#84-préstamos-de-computadoras--apiv1device-loan)
   - [8.5 Casilleros](#85-casilleros--apiv1locker)
   - [8.6 Préstamos de casilleros](#86-préstamos-de-casilleros--apiv1locker-loan)
   - [8.7 Cuentas WiFi](#87-cuentas-wifi--apiv1wifi-user)
   - [8.8 Check-in (ingresos)](#88-check-in-ingresos--apiv1checkin)
   - [8.9 Archivos estáticos](#89-archivos-estáticos--uploads)
9. [Modelo de datos](#9-modelo-de-datos)
10. [Tareas programadas](#10-tareas-programadas)
11. [Resumen de endpoints](#11-resumen-de-endpoints)

---

## 1. Arquitectura

```
┌──────────────┐  HTTPS   ┌──────────────────────────┐   HTTP    ┌─────────────────────┐   SQL   ┌──────────────┐
│  Navegador   │ ───────▶ │  Nginx (contenedor       │ ────────▶ │ Backend Express 5   │ ──────▶ │ PostgreSQL 16│
│  (React SPA) │          │  frontend) :80 / :443    │  /api/... │ TypeORM  :5000      │         │  (db)        │
└──────────────┘          └──────────────────────────┘           └─────────────────────┘         └──────────────┘
                                                                     │            │
                                                     API UCA (SIU) ◀─┘            └─▶ SMTP Office 365
                                                 (sincroniza usuarios)               (recordatorios)
```

| Capa | Tecnología | Carpeta |
|------|------------|---------|
| Frontend | React 19 + Vite 7 + TypeScript, MUI 7, Tailwind 4, TanStack Query/Table, react-hook-form | `craisistem-frontend/` |
| Backend | Node.js + Express 5 + TypeScript, TypeORM 0.3, express-validator, Passport (Microsoft), JWT, multer, node-cron, nodemailer | `craisistem-backend/` |
| Base de datos | PostgreSQL 16 | contenedor `db` |
| Despliegue | Docker Compose (3 contenedores: `db`, `backend`, `frontend` con Nginx) | `docker-compose.yml` |

### Estructura del backend

```
craisistem-backend/src
├── index.ts               # Arranque: conecta BD, ejecuta seeds, levanta servidor y cron jobs
├── server.ts              # Configuración de Express (CORS, JSON, rutas /api/v1, /uploads, errores)
├── configs/               # BD (TypeORM), Microsoft OAuth, axios para la API UCA
├── routers/               # Definición de rutas y middlewares por recurso
├── controllers/           # Leen la petición y arman la respuesta HTTP
├── services/              # Reglas de negocio
├── repository/            # Acceso a datos (TypeORM) + specifications (filtros dinámicos)
├── models/                # Entidades TypeORM y tipos (DTO)
├── mappers/               # Conversión entidad → respuesta JSON / query → filtros
├── validators/            # Reglas de express-validator
├── middlewares/           # Autenticación/autorización, validación, errores, carga de CSV
├── job/                   # Cron: sincronización de usuarios y recordatorios por correo
└── utils/                 # Constantes (roles, estados, tipos), JWT, fechas, seeds
```

Flujo de una petición: `router → authentication → authorization(rol) → validators → validathor → controller → service → repository → BD`.

---

## 2. Instalación y ejecución

> La guía paso a paso está en [INSTALACION.md](INSTALACION.md). Aquí solo un resumen.

### Desarrollo local

Requisitos: Node.js 20+, PostgreSQL 16.

```bash
# Backend
cd craisistem-backend
npm install
# crear un archivo .env en craisistem-backend/ (ver sección 3) con DB_HOST=localhost
npm run dev            # http://localhost:5000/api/v1
```

```bash
# Frontend
cd craisistem-frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
npm run dev            # http://localhost:5173
```

Al iniciar, el backend crea/actualiza las tablas automáticamente (`synchronize: true`) y ejecuta los *seeds*:

| Seed | Qué hace |
|------|----------|
| `seedRoles` | Crea los roles `admin`, `user`, `learningcenter`, `reception`, `librarian`. |
| `seedAdminUser` | Crea/actualiza el usuario administrador inicial (`ADMIN_ID` / `ADMIN_EMAIL`, por defecto `admin01` / `admin@example.com`) con rol `admin`. |
| `seedLockers` | Crea casilleros hasta completar 140. |

### Producción (Docker)

```bash
cp .env.template .env      # completar valores
# colocar certificados en ./certs/biblioteca.crt y ./certs/biblioteca.key
docker compose up -d --build
```

Nginx sirve el frontend y redirige `https://<dominio>/api/...` al backend (`http://backend:5000/api/...`).

---

## 3. Variables de entorno

Archivo `.env` en la raíz del proyecto (plantilla: `.env.template`). En Docker se cargan todas en el backend mediante `env_file`.

| Variable | Usada por | Obligatoria | Descripción |
|----------|-----------|:-----------:|-------------|
| `DB_HOST` | backend | Sí | Host de PostgreSQL (`db` en Docker, `localhost` en local). |
| `DB_PORT` | backend | Sí | Puerto de PostgreSQL (5432). |
| `DB_USERNAME` / `DB_PASSWORD` / `DB_NAME` | backend, db | Sí | Credenciales y nombre de la base. |
| `BACKEND_PORT` | backend | No | Puerto HTTP (por defecto 5000). |
| `NODE_ENV` | backend | No | `development` añade el *stack* a los errores 500. |
| `TOKEN_SECRET` | backend | **Sí** | Secreto para firmar los JWT. Si falta se usa un valor por defecto inseguro y se muestra una advertencia. |
| `TOKEN_EXP` | backend | No | Duración del token (`1d` por defecto). |
| `ADMIN_ID` / `ADMIN_EMAIL` | backend | No | Id y correo del administrador inicial creado por el *seed* (por defecto `admin01` / `admin@example.com`). |
| `ENABLE_EMAIL_LOGIN` | backend | No | `false` desactiva `POST /auth/login` (inicio de sesión temporal solo con correo). |
| `FRONTEND_URL` | backend | Sí | Origen permitido por CORS y destino de la redirección después del login Microsoft. |
| `API_URL` | backend | No | URL pública del backend; se antepone a las fotos guardadas localmente (`/uploads/...`). |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | backend | Para SSO | Credenciales de la aplicación registrada en Azure (Entra ID). |
| `MICROSOFT_TENANT` | backend | No | Tenant de Azure (`common` por defecto). |
| `MICROSOFT_CALLBACK_URL` | backend | Para SSO | URL de retorno: `https://<dominio>/api/v1/auth/microsoft/callback`. |
| `UCA_API` / `UCA_TOKEN` | backend | Para sincronizar | URL base y token Bearer de la API institucional (reportes SIU). |
| `OUTLOOK_USER` / `OUTLOOK_PASSWORD` | backend | Para correos | Cuenta de Office 365 que envía los recordatorios. |
| `VITE_API_URL` | frontend (build) | Sí | URL base de la API, **debe terminar en `/api/v1`**. |

---

## 4. Convenciones generales de la API

| Concepto | Valor |
|----------|-------|
| URL base (local) | `http://localhost:5000/api/v1` |
| URL base (producción) | `https://biblioteca.uca.edu.sv/api/v1` |
| Formato | JSON (`Content-Type: application/json`), excepto la carga de CSV (`multipart/form-data`). |
| Fechas | `YYYY-MM-DD` (columnas `date`). |
| Horas | `HH:MM:SS` en hora de El Salvador (columnas `time`). En filtros se usa `HH:MM`. |
| Identificador de usuario | `id` = carnet / código institucional (texto, máx. 15 caracteres). Ej.: `00012320`, `4-000124`. |
| Identificador de préstamo | UUID. |
| Identificador de computadora y casillero | Entero autoincremental. |

### Enumeraciones

| Enum | Valores |
|------|---------|
| Rol (`Roles`) | `admin`, `user`, `librarian`, `learningcenter`, `reception` |
| Estado de usuario | `active`, `inactive` |
| Estado de recurso (computadora/casillero) | `free`, `occupied`, `maintenance` |
| Sistema operativo | `windows`, `mac`, `linux` |
| Tipo de usuario | `student`, `employee`, `xpec`, `4` (lector ocasional privado), `5` (lector ocasional público), `6` (investigador 6 meses), `8` (investigador 1 mes), `9` (cortesía), `17` (hijo de empleado) |

---

## 5. Autenticación y roles

### Token

Todas las rutas, salvo `POST /auth/login` y las de Microsoft, requieren el encabezado:

```
Authorization: Bearer <token JWT>
```

El token se firma con `TOKEN_SECRET` (HS256), contiene `{ email, sub (id del usuario), iat, exp }` y vence según `TOKEN_EXP` (1 día por defecto). En cada petición el backend vuelve a buscar al usuario por su correo, por lo que los cambios de rol aplican de inmediato.

### Formas de obtener el token

1. **Microsoft (institucional)**: el navegador abre `GET /auth/microsoft`; al volver, el backend redirige a `FRONTEND_URL/login?token=<jwt>`.
2. **Correo (temporal)**: `POST /auth/login` con el correo. Se puede desactivar con `ENABLE_EMAIL_LOGIN=false`.

En ambos casos el usuario debe existir en la base de datos y tener al menos un rol distinto de `user`.

### Roles y permisos

El rol `admin` tiene acceso a **todas** las rutas (la verificación de rol siempre acepta `admin`).

| Rol | Nombre en la interfaz | Puede usar |
|-----|-----------------------|------------|
| `admin` | Administrador | Todo, incluido: crear computadoras, editar computadoras, asignar/quitar roles, sincronizar usuarios, crear administradores. |
| `learningcenter` | Learning Center | Préstamos de computadoras, inventario (consulta), consultas de préstamos de computadoras, buscar usuario por carnet. |
| `reception` | Recepción | Casilleros, préstamos de casilleros, check-in y sus consultas, buscar usuario por carnet. |
| `librarian` | Bibliotecario | Listado y creación de usuarios, cuentas WiFi (carga CSV, asignación, consulta), buscar usuario por carnet. |
| `user` | Usuario | Rol base de todo usuario sincronizado. **No** permite entrar al sistema. |

### Errores comunes de autenticación/autorización

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 401 | `{"status":401,"message":"Usuario no autenticado"}` | Falta el encabezado, no usa el prefijo `Bearer`, token inválido/vencido o el usuario del token ya no existe. |
| 403 | `{"status":403,"message":"Usuario no autorizado"}` | El usuario no tiene el rol requerido ni es `admin`. |

> El frontend, al recibir un 401, borra el token y redirige a `/login`.

---

## 6. Formato de errores

La API devuelve dos formatos de error:

**a) Error de negocio / HTTP** (lanzado con `http-errors`):

```json
{ "status": 404, "message": "Usuario no encontrado" }
```

**b) Error de validación** (express-validator) — siempre `400`, un mensaje por campo:

```json
{
  "errors": [
    { "field": "email", "message": "Correo electronico invalido" },
    { "field": "type",  "message": "type debe ser uno de: student, employee, xpec, 4, 5, 6, 8, 9, 17" }
  ]
}
```

**c) Error interno** — `500`, sin detalles (los detalles quedan en el log del servidor; con `NODE_ENV=development` se agrega `stack`):

```json
{ "status": 500, "message": "Error del servidor" }
```

---

## 7. Paginación

Los listados aceptan:

| Parámetro (query) | Tipo | Defecto | Regla |
|-------------------|------|---------|-------|
| `page` | entero | 1 | ≥ 1 |
| `limit` | entero | 10 | entre 1 y 200 |

Y responden con:

```json
{
  "data": [ ... ],
  "pagination": {
    "total": 140,
    "limit": 3,
    "page": 1,
    "totalPages": 47,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Errores de paginación (400):

```json
{ "errors": [ { "field": "page",  "message": "page debe ser un numero entero mayor o igual a 1" } ] }
{ "errors": [ { "field": "limit", "message": "limit debe ser un número entero entre 1 y 200" } ] }
```

---

## 8. Endpoints

Notación usada en cada endpoint:

- **Rol**: rol mínimo requerido (siempre se acepta también `admin`).
- **Errores**: además de los listados, toda ruta protegida puede responder **401**, **403** (sección 5) y **500** (sección 6).

---

### 8.1 Auth — `/api/v1/auth`

#### `GET /auth/microsoft`

Inicia el inicio de sesión con Microsoft (OAuth 2.0). Se abre desde el navegador, no con `fetch`.

| | |
|---|---|
| Autenticación | Pública |
| Respuesta | `302` → página de inicio de sesión de Microsoft (`prompt=select_account`, scope `user.read`). |

#### `GET /auth/microsoft/callback`

URL a la que Microsoft devuelve al usuario. Debe coincidir con `MICROSOFT_CALLBACK_URL`.

| | |
|---|---|
| Autenticación | Pública (la llama Microsoft) |
| Query | `code`, `state` (los agrega Microsoft) |

Respuestas (siempre `302` hacia el frontend):

| Caso | Redirección |
|------|-------------|
| Éxito | `FRONTEND_URL/login?token=<jwt>` |
| La cuenta Microsoft no trae correo | `FRONTEND_URL/login?error=No se pudo obtener el correo institucional de la cuenta Microsoft.` |
| El correo no está registrado | `FRONTEND_URL/login?error=El usuario no se encuentra registrado en el sistema.` |
| El usuario solo tiene el rol `user` | `FRONTEND_URL/login?error=El usuario no tiene permisos para acceder al sistema` |
| Otro error de Microsoft | `FRONTEND_URL/login?error=Error en la autenticación institucional` |

---

#### `POST /auth/login`

Inicio de sesión temporal usando solo el correo (pensado para pruebas mientras se configura Microsoft).

| | |
|---|---|
| Autenticación | Pública |
| Body | JSON |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `email` | string | Sí | Correo válido |

```json
{ "email": "admin@example.com" }
```

Respuesta `200 OK`:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjoiYWRtaW4wMSIs..." }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"email","message":"Correo electronico invalido"}]}` | Falta el correo o no tiene formato válido. |
| 401 | `{"status":401,"message":"Correo no registrado"}` | No existe un usuario con ese correo. |
| 403 | `{"status":403,"message":"El usuario no tiene permisos para acceder al sistema"}` | El usuario solo tiene el rol `user`. |
| 403 | `{"status":403,"message":"El inicio de sesion por correo esta deshabilitado. Use su cuenta Microsoft."}` | `ENABLE_EMAIL_LOGIN=false`. |

---

#### `POST /auth/register`

Crea un usuario con rol **admin**.

| | |
|---|---|
| Rol | `admin` |
| Body | JSON |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `id` | string | Sí | 1–15 caracteres (carnet / código) |
| `firstName` | string | Sí | No vacío |
| `lastName` | string | Sí | No vacío |
| `email` | string | Sí | Correo válido, único |
| `gender` | string | Sí | Texto (ej. `M`, `F`) |
| `type` | string | Sí | Uno de los tipos de usuario (sección 4) |
| `expirationDate` | string | No | `YYYY-MM-DD` (por defecto, la fecha de hoy) |

```json
{
  "id": "admin02",
  "firstName": "Ana",
  "lastName": "Lopez",
  "email": "ana@uca.edu.sv",
  "gender": "F",
  "type": "employee"
}
```

Respuesta `201 Created`:

```json
{ "message": "Usuario registrado" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"firstName","message":"firstName es requerido"}, ...]}` | Campos faltantes o inválidos. |
| 409 | `{"status":409,"message":"Ya existe un usuario con ese id"}` | El `id` ya existe. |
| 409 | `{"status":409,"message":"Ya existe un usuario con ese correo"}` | El `email` ya existe. |

---

#### `GET /auth/whoami`

Devuelve los datos del usuario autenticado. El frontend lo usa para saber qué menús mostrar.

| | |
|---|---|
| Rol | Cualquier usuario autenticado |

Respuesta `200 OK`:

```json
{
  "id": "admin01",
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "type": "employee",
  "faculty": "administration",
  "roles": ["admin"]
}
```

Errores: `401` (token ausente o inválido).

---

### 8.2 Usuarios — `/api/v1/user`

Objeto **Usuario** (respuesta):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Carnet / código |
| `firstName`, `lastName` | string | Nombres y apellidos |
| `email` | string | Correo |
| `type` | string | Tipo de usuario |
| `photo` | string \| null | URL de la foto |
| `state` | `active` \| `inactive` | Estado |
| `roles` | string[] | Nombres de los roles |
| `gender` | string | Género |
| `faculty` | string | Facultad / decanato (`N/A` para usuarios creados manualmente) |
| `expirationDate` | string | Fecha de vencimiento `YYYY-MM-DD` |

#### `GET /user`

Lista paginada de usuarios con filtros.

| | |
|---|---|
| Rol | `librarian` |

Query:

| Parámetro | Tipo | Búsqueda | Regla |
|-----------|------|----------|-------|
| `page`, `limit` | entero | — | Ver sección 7 |
| `id` | string | Exacta | No vacío |
| `firstName` | string | Parcial, sin distinguir mayúsculas | — |
| `lastName` | string | Parcial | — |
| `email` | string | Parcial | Debe ser un correo válido |
| `type` | string | Exacta | — |
| `faculty` | string | Parcial | — |
| `state` | string | Exacta | `active` o `inactive` |
| `order` | string | — | Campo de orden; prefijo `-` = descendente. Valores: `id`, `firstName`, `lastName`, `email`, `type`, `faculty`, `expirationDate`, `state` |

Ejemplo: `GET /api/v1/user?order=-firstName&limit=2`

Respuesta `200 OK`:

```json
{
  "data": [
    {
      "id": "4-000125",
      "firstName": "Maria",
      "lastName": "Gomez",
      "email": "maria@gmail.com",
      "type": "5",
      "photo": null,
      "state": "active",
      "roles": ["user"],
      "gender": "F",
      "faculty": "N/A",
      "expirationDate": "2026-11-21"
    },
    {
      "id": "4-000124",
      "firstName": "Juan",
      "lastName": "Perez",
      "email": "juan@gmail.com",
      "type": "4",
      "photo": null,
      "state": "active",
      "roles": ["user"],
      "gender": "M",
      "faculty": "N/A",
      "expirationDate": "2026-12-31"
    }
  ],
  "pagination": { "total": 3, "limit": 2, "page": 1, "totalPages": 2, "hasNextPage": true, "hasPreviousPage": false }
}
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"state","message":"Estado invalido: foo"}]}` | `state` no válido. |
| 400 | `{"errors":[{"field":"email","message":"Correo electrónico inválido"}]}` | `email` no es un correo. |
| 400 | `{"errors":[{"field":"order","message":"Campo de orden inválido: x"}]}` | `order` no permitido. |

---

#### `GET /user/:identifier`

Busca un usuario por su carnet. Se usa en las pantallas de préstamo de computadoras, préstamo de casilleros y asignación WiFi para mostrar nombre y foto antes de confirmar.

| | |
|---|---|
| Rol | `learningcenter`, `reception` o `librarian` (cualquiera de ellos) |
| Parámetro de ruta | `identifier` — id/carnet del usuario |

Respuesta `200 OK`:

```json
{
  "id": "4-000124",
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juan@gmail.com",
  "type": "4",
  "photo": null,
  "state": "active",
  "roles": ["user"],
  "gender": "M",
  "faculty": "N/A",
  "expirationDate": "2026-12-31"
}
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 404 | `{"status":404,"message":"Usuario no encontrado"}` | El carnet no existe. |

---

#### `POST /user`

Registra manualmente un usuario externo (lectores ocasionales, investigadores, cortesías, etc.) con rol `user`.

| | |
|---|---|
| Rol | `librarian` |
| Body | JSON (mismos campos que `POST /auth/register`) |

```json
{
  "id": "4-000124",
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juan@gmail.com",
  "gender": "M",
  "type": "4",
  "expirationDate": "2026-12-31"
}
```

> El frontend arma el `id` como `<prefijo>-<número de carnet>` (ej. `4-000124`) y envía `type` = prefijo.

Respuesta `201 Created`:

```json
{ "message": "Usuario registrado" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"email","message":"Correo electronico invalido"},{"field":"type","message":"type debe ser uno de: student, employee, xpec, 4, 5, 6, 8, 9, 17"}]}` | Datos faltantes o inválidos. |
| 409 | `{"status":409,"message":"Ya existe un usuario con ese id"}` | Carnet duplicado. |
| 409 | `{"status":409,"message":"Ya existe un usuario con ese correo"}` | Correo duplicado. |

---

#### `PATCH /user/:identifier/roles`

Asigna un rol a un usuario.

| | |
|---|---|
| Rol | `admin` |
| Parámetro de ruta | `identifier` — id del usuario |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `role` | string | Sí | Uno de: `admin`, `user`, `librarian`, `learningcenter`, `reception` |

```json
{ "role": "reception" }
```

Respuesta `200 OK`:

```json
{ "message": "Rol asignado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"role","message":"Rol inválido: superman"}]}` | Rol inexistente o ausente. |
| 404 | `{"status":404,"message":"Usuario no encontrado"}` | El usuario no existe. |
| 409 | `{"status":409,"message":"El usuario ya posee este rol"}` | El rol ya estaba asignado. |

---

#### `DELETE /user/:identifier/roles`

Quita un rol a un usuario. El rol se envía en el **body** (el frontend usa `axios.delete(url, { data: { role } })`).

| | |
|---|---|
| Rol | `admin` |
| Parámetro de ruta | `identifier` — id del usuario |
| Body | `{ "role": "<rol>" }` |

Respuesta `200 OK`:

```json
{ "message": "Rol removido correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"role","message":"Rol inválido: x"}]}` | Rol inválido. |
| 400 | `{"status":400,"message":"No se puede eliminar el rol base del usuario"}` | Se intentó quitar el rol `user`. |
| 404 | `{"status":404,"message":"Usuario no encontrado"}` | El usuario no existe. |
| 404 | `{"status":404,"message":"El usuario no posee este rol"}` | El usuario no tenía ese rol. |

---

#### `PATCH /user/manual-fetch`

Ejecuta de inmediato la sincronización de usuarios con la API institucional (la misma que corre cada medianoche). Ver [sección 10](#10-tareas-programadas).

| | |
|---|---|
| Rol | `admin` |
| Body | Ninguno |

Respuesta `200 OK` (cuando termina):

```json
{ "message": "Sincronización manual completada" }
```

> Si la API institucional no responde, la sincronización de esa fuente se omite (se registra en el log) y la respuesta sigue siendo 200. Puede tardar varios segundos/minutos según la cantidad de registros.

---

### 8.3 Computadoras — `/api/v1/device`

Objeto **Computadora**:

```json
{
  "id": 1,
  "brand": "Dell",
  "state": "free",
  "section": "A1",
  "model": "Optiplex 7090",
  "inventory": "INV-001",
  "operatingSystem": "windows"
}
```

#### `POST /device`

Registra una computadora. Siempre se crea con estado `free`.

| | |
|---|---|
| Rol | `admin` |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `brand` | string | Sí | 2–50 caracteres |
| `section` | string | Sí | 1–20 caracteres |
| `model` | string | Sí | 1–100 caracteres |
| `inventory` | string | Sí | Solo MAYÚSCULAS, números y guiones; máx. 30 |
| `operatingSystem` | string | Sí | `windows`, `mac` o `linux` |

```json
{ "brand": "Dell", "section": "A1", "model": "Optiplex 7090", "inventory": "INV-001", "operatingSystem": "windows" }
```

Respuesta `201 Created`:

```json
{ "message": "Computadora registrada correctamente" }
```

Errores:

| Código | Cuerpo |
|--------|--------|
| 400 | `{"errors":[{"field":"brand","message":"brand debe tener entre 2 y 50 caracteres"},{"field":"section","message":"section debe tener entre 1 y 20 caracteres"},{"field":"inventory","message":"inventory solo admite letras mayusculas, numeros y guiones"},{"field":"operatingSystem","message":"operatingSystem debe ser uno de: windows, mac, linux"}]}` |

---

#### `GET /device`

Lista paginada de computadoras.

| | |
|---|---|
| Rol | `learningcenter` |

Query:

| Parámetro | Tipo | Búsqueda | Regla |
|-----------|------|----------|-------|
| `page`, `limit` | entero | — | Sección 7 |
| `id` | entero | Exacta | ≥ 1 |
| `brand`, `model`, `section`, `inventory` | string | Exacta | — |
| `state` | string | Exacta | `free`, `occupied`, `maintenance` |
| `operatingSystem` | string | Exacta | `windows`, `mac`, `linux` |
| `order` | string | — | `id` (defecto), `brand`, `state`, `section`, `model`, `inventory`, `operatingSystem`; prefijo `-` = descendente |

Ejemplo: `GET /api/v1/device?state=free&operatingSystem=windows`

Respuesta `200 OK`:

```json
{
  "data": [
    { "id": 1, "brand": "Dell", "state": "free", "section": "A1", "model": "Optiplex 7090", "inventory": "INV-001", "operatingSystem": "windows" }
  ],
  "pagination": { "total": 1, "limit": 10, "page": 1, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
}
```

Errores:

| Código | Cuerpo |
|--------|--------|
| 400 | `{"errors":[{"field":"id","message":"id debe ser un numero entero"}]}` |
| 400 | `{"errors":[{"field":"state","message":"Estado invalido"}]}` |
| 400 | `{"errors":[{"field":"limit","message":"limit debe ser un número entero entre 1 y 200"}]}` |

---

#### `PUT /device/:identifier`

Actualiza una computadora. Funciona como actualización **parcial**: solo se modifican los campos enviados.

| | |
|---|---|
| Rol | `admin` |
| Parámetro de ruta | `identifier` — id numérico de la computadora |

Body (todos opcionales, mismas reglas que en `POST /device`, más `state`):

| Campo | Tipo | Regla |
|-------|------|-------|
| `brand`, `section`, `model`, `inventory`, `operatingSystem` | string | Igual que en creación |
| `state` | string | `free`, `occupied`, `maintenance` |

```json
{ "section": "B3", "state": "maintenance" }
```

Respuesta `200 OK`:

```json
{ "message": "Computadora actualizada correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"status":400,"message":"El id del equipo debe ser un numero entero"}` | `identifier` no numérico. |
| 400 | `{"errors":[{"field":"state","message":"state debe ser uno de: free, occupied, maintenance"}]}` | Valor inválido. |
| 404 | `{"status":404,"message":"Equipo no encontrado"}` | No existe la computadora. |

> Precaución: cambiar manualmente `state` a `free` mientras existe un préstamo activo deja el préstamo abierto. Use `POST /device-loan/release/:id` para finalizar préstamos.

---

### 8.4 Préstamos de computadoras — `/api/v1/device-loan`

Objeto **Préstamo de computadora**:

```json
{
  "id": "4c697584-ddf8-41f2-ad7d-d4cfef289591",
  "date": "2026-11-20",
  "user":   { "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "photo": null },
  "charge": { "startTime": "23:47:19", "librarian": { "firstName": "Admin", "lastName": "User" } },
  "release": null,
  "device": { "id": 1, "operatingSystem": "windows" }
}
```

- `charge`: entrega (cargo) — hora de inicio y quién la registró.
- `release`: devolución (descargo) — `null` mientras el préstamo está activo; si se finalizó: `{ "endTime": "...", "librarian": {...} }`.

#### `POST /device-loan/charge`

Presta una computadora a un usuario.

| | |
|---|---|
| Rol | `learningcenter` |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `userId` | string | Sí | Carnet del usuario |
| `resourceId` | entero | Sí | Id de la computadora (≥ 1) |

```json
{ "userId": "4-000124", "resourceId": 1 }
```

Reglas de negocio: el usuario debe existir y estar `active`; la computadora debe existir y estar `free`; el usuario no puede tener otro préstamo de computadora activo. Al crear el préstamo la computadora pasa a `occupied` y se registra la hora (El Salvador) y el bibliotecario que atendió.

Respuesta `201 Created`:

```json
{ "message": "Prestamo registrado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"userId","message":"userId es requerido"},{"field":"resourceId","message":"resourceId debe ser un numero entero"}]}` | Body inválido. |
| 404 | `{"status":404,"message":"Usuario no encontrado!"}` | Carnet inexistente. |
| 404 | `{"status":404,"message":"Equipo no encontrado!"}` | Computadora inexistente. |
| 409 | `{"status":409,"message":"El usuario esta inactivo!"}` | Usuario `inactive`. |
| 409 | `{"status":409,"message":"El equipo ya esta en uso"}` | Computadora `occupied` o `maintenance`. |
| 409 | `{"status":409,"message":"El usuario ya tiene un prestamo activo"}` | Ya tiene una computadora prestada. |

---

#### `POST /device-loan/release/:identifier`

Finaliza (devuelve) un préstamo de computadora.

| | |
|---|---|
| Rol | `learningcenter` |
| Parámetro de ruta | `identifier` — UUID del préstamo |
| Body | Ninguno |

Respuesta `200 OK`:

```json
{ "message": "Prestamo finalizado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"identifier","message":"Identifier debe ser un UUID"}]}` | El id no es un UUID. |
| 400 | `{"status":400,"message":"El prestamo indicado no corresponde a una computadora"}` | El UUID es de un préstamo de casillero. |
| 404 | `{"status":404,"message":"Prestamo no encontrado!"}` | No existe el préstamo. |
| 409 | `{"status":409,"message":"El prestamo ya se ha completado!"}` | Ya había sido finalizado. |

---

#### `GET /device-loan`

Historial paginado de préstamos de computadoras.

| | |
|---|---|
| Rol | `learningcenter` |

Query:

| Parámetro | Tipo | Descripción / regla |
|-----------|------|---------------------|
| `page`, `limit` | entero | Sección 7 |
| `date` | fecha ISO | Préstamos de esa fecha exacta |
| `dateFrom`, `dateTo` | fecha ISO | Rango de fechas (inclusive) |
| `userId` | string | Carnet del usuario |
| `deviceId` | número | Id de la computadora |
| `hasCharge` | `true`/`false` | Con / sin registro de entrega |
| `hasRelease` | `true`/`false` | `false` = préstamos activos; `true` = finalizados |
| `chargeLibrarianId` | string | Id de quien entregó |
| `releaseLibrarianId` | string | Id de quien recibió |
| `chargeTimeFrom`, `chargeTimeTo` | `HH:MM` | Rango de hora de entrega |
| `releaseTimeFrom`, `releaseTimeTo` | `HH:MM` | Rango de hora de devolución |
| `order` | string | Un campo: `date` (defecto `-date`), `user`, `device`, `chargeTime`, `releaseTime`; prefijo `-` = descendente |

Ejemplo: `GET /api/v1/device-loan?hasRelease=false` (préstamos activos)

Respuesta `200 OK`:

```json
{
  "data": [
    {
      "id": "4c697584-ddf8-41f2-ad7d-d4cfef289591",
      "date": "2026-11-20",
      "user": { "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "photo": null },
      "charge": { "startTime": "23:47:19", "librarian": { "firstName": "Admin", "lastName": "User" } },
      "release": null,
      "device": { "id": 1, "operatingSystem": "windows" }
    }
  ],
  "pagination": { "total": 1, "limit": 10, "page": 1, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
}
```

Errores:

| Código | Cuerpo |
|--------|--------|
| 400 | `{"errors":[{"field":"date","message":"Fecha inválida"}]}` |
| 400 | `{"errors":[{"field":"hasRelease","message":"hasRelease debe ser true o false"}]}` |
| 400 | `{"errors":[{"field":"chargeTimeFrom","message":"Hora de carga desde inválida"}]}` |
| 400 | `{"errors":[{"field":"order","message":"Campo de orden inválido: nombre"}]}` |
| 400 | `{"errors":[{"field":"deviceId","message":"ID de computadora inválido"}]}` |

---

### 8.5 Casilleros — `/api/v1/locker`

#### `GET /locker`

Lista paginada de casilleros ordenada por id. El frontend pide `limit=140` para dibujar la cuadrícula completa.

| | |
|---|---|
| Rol | `reception` |
| Query | `page` (defecto 1), `limit` (defecto 10) |

Respuesta `200 OK` (`GET /api/v1/locker?limit=3`):

```json
{
  "data": [
    { "id": 1, "state": "free" },
    { "id": 2, "state": "free" },
    { "id": 3, "state": "free" }
  ],
  "pagination": { "total": 140, "limit": 3, "page": 1, "totalPages": 47, "hasNextPage": true, "hasPreviousPage": false }
}
```

> No existen endpoints para crear o eliminar casilleros: los 140 se crean automáticamente al iniciar el backend.

---

### 8.6 Préstamos de casilleros — `/api/v1/locker-loan`

Objeto **Préstamo de casillero**: igual al de computadora, pero con `locker` en lugar de `device`:

```json
{
  "id": "fae6b0ae-6ac2-4fc4-a3f1-ada09ce257b6",
  "date": "2026-11-20",
  "user": { "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "photo": null },
  "charge": { "startTime": "23:47:19", "librarian": { "firstName": "Juan", "lastName": "Perez" } },
  "release": null,
  "locker": { "id": 5 }
}
```

#### `POST /locker-loan/charge`

Presta un casillero. **También registra automáticamente un check-in** (ingreso) del usuario.

| | |
|---|---|
| Rol | `reception` |

Body:

| Campo | Tipo | Requerido | Regla |
|-------|------|:---------:|-------|
| `userId` | string | Sí | Carnet del usuario |
| `resourceId` | entero | Sí | Número del casillero (1–140) |

```json
{ "userId": "4-000124", "resourceId": 5 }
```

Respuesta `201 Created`:

```json
{ "message": "Prestamo registrado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[...]}` | Body inválido (igual que en computadoras). |
| 404 | `{"status":404,"message":"Usuario no encontrado!"}` | Carnet inexistente. |
| 404 | `{"status":404,"message":"Casillero no encontrado!"}` | Número de casillero inexistente. |
| 409 | `{"status":409,"message":"El usuario esta inactivo!"}` | Usuario `inactive`. |
| 409 | `{"status":409,"message":"El casillero ya esta en uso"}` | Casillero ocupado. |
| 409 | `{"status":409,"message":"El usuario ya tiene un prestamo activo"}` | Ya tiene un casillero prestado. |

---

#### `POST /locker-loan/release/:identifier`

Libera un casillero (finaliza el préstamo).

| | |
|---|---|
| Rol | `reception` |
| Parámetro de ruta | `identifier` — UUID del préstamo |

Respuesta `200 OK`:

```json
{ "message": "Prestamo finalizado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"identifier","message":"Identifier debe ser un UUID"}]}` | Id inválido. |
| 400 | `{"status":400,"message":"El prestamo indicado no corresponde a un casillero"}` | El UUID es de un préstamo de computadora. |
| 404 | `{"status":404,"message":"Prestamo no encontrado!"}` | No existe. |
| 409 | `{"status":409,"message":"El prestamo ya se ha completado"}` | Ya fue liberado. |

---

#### `GET /locker-loan`

Historial paginado de préstamos de casilleros.

| | |
|---|---|
| Rol | `reception` |
| Query | Los mismos filtros de `GET /device-loan`, cambiando `deviceId` por **`lockerId`** (número). En `order` también se acepta `locker`. |

Respuesta `200 OK`: igual estructura que `GET /device-loan` con objetos *Préstamo de casillero*.

Errores: los mismos de `GET /device-loan`, y `{"errors":[{"field":"lockerId","message":"ID de casillero inválido"}]}`.

---

### 8.7 Cuentas WiFi — `/api/v1/wifi-user`

Objeto **Cuenta WiFi**:

```json
{
  "id": "wifi0001",
  "password": "Abc123",
  "creationDate": "2026-11-21",
  "expirationDate": "2026-12-31",
  "assignments": [
    {
      "user": { "id": "4-000124", "firstName": "Juan", "lastName": "Perez" },
      "librarian": { "firstName": "Admin", "lastName": "User" },
      "timestamp": "2026-11-21T05:48:17.592Z"
    }
  ]
}
```

#### `POST /wifi-user/import`

Carga cuentas WiFi desde un archivo CSV. Todas las cuentas cargadas vencen el **31 de diciembre del año en curso**. Las cuentas cuyo `id` ya existe se omiten.

| | |
|---|---|
| Rol | `librarian` |
| Content-Type | `multipart/form-data` |
| Campo del formulario | `file` — archivo `.csv`, máx. 5 MB |

Formato del CSV (con encabezado):

```csv
id,password
wifi0001,Abc123
wifi0002,Xyz789
```

- `id`: máximo 8 caracteres (las filas con un id más largo o sin `id`/`password` se omiten).

Ejemplo con curl:

```bash
curl -X POST https://biblioteca.uca.edu.sv/api/v1/wifi-user/import \
  -H "Authorization: Bearer <token>" \
  -F "file=@cuentas.csv"
```

Respuesta `200 OK`:

```json
{
  "message": "2 usuarios insertados, 2 omitidos",
  "inserted": 2,
  "skipped": 2,
  "total": 4,
  "users": [
    { "id": "wifi0001", "password": "Abc123", "creationDate": "2026-11-21", "expirationDate": "2026-12-31" },
    { "id": "wifi0002", "password": "Xyz789", "creationDate": "2026-11-21", "expirationDate": "2026-12-31" }
  ]
}
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"status":400,"message":"No se subio el archivo!"}` | No se envió el campo `file`. |
| 400 | `{"status":400,"message":"Solo se permiten archivos CSV"}` | El archivo no es `.csv`. |
| 400 | `{"status":400,"message":"El CSV debe tener las columnas 'id' y 'password' con al menos una fila valida"}` | CSV sin columnas correctas. |
| 400 | `{"status":400,"message":"File too large"}` | Archivo mayor a 5 MB. |

---

#### `GET /wifi-user`

Lista paginada de cuentas WiFi con su historial de asignaciones.

| | |
|---|---|
| Rol | `librarian` |

Query:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page`, `limit` | entero | Sección 7 |
| `wifiUserId` | string | Id de la cuenta WiFi |
| `userId` | string | Cuentas asignadas a ese carnet |
| `librarianId` | string | Cuentas asignadas por ese bibliotecario |
| `creationDate` | `YYYY-MM-DD` | Fecha de creación exacta |
| `expirationDate` | `YYYY-MM-DD` | Fecha de vencimiento exacta |

Respuesta `200 OK` (`GET /api/v1/wifi-user?userId=4-000124`):

```json
{
  "data": [
    {
      "id": "wifi0001",
      "password": "Abc123",
      "creationDate": "2026-11-21",
      "expirationDate": "2026-12-31",
      "assignments": [
        {
          "user": { "id": "4-000124", "firstName": "Juan", "lastName": "Perez" },
          "librarian": { "firstName": "Admin", "lastName": "User" },
          "timestamp": "2026-11-21T05:48:17.592Z"
        }
      ]
    }
  ],
  "pagination": { "total": 1, "limit": 10, "page": 1, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
}
```

---

#### `POST /wifi-user/assign`

Asigna una cuenta WiFi a un usuario.

| | |
|---|---|
| Rol | `librarian` |

Body:

| Campo | Tipo | Requerido |
|-------|------|:---------:|
| `userId` | string | Sí |
| `wifiUserId` | string | Sí |

```json
{ "userId": "4-000124", "wifiUserId": "wifi0001" }
```

Reglas: una cuenta WiFi puede compartirse con **máximo 3** usuarios; un usuario solo puede tener **una** cuenta WiFi vigente (no vencida).

Respuesta `201 Created`:

```json
{ "message": "Usuario asignado correctamente" }
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 400 | `{"errors":[{"field":"wifiUserId","message":"wifiUserId es requerido"}]}` | Body inválido. |
| 404 | `{"status":404,"message":"Usuario no encontrado!"}` | Carnet inexistente. |
| 404 | `{"status":404,"message":"Usuario wifi no encontrado!"}` | Cuenta WiFi inexistente. |
| 409 | `{"status":409,"message":"Demasiados usuarios asignados a este usuario wifi!"}` | La cuenta ya tiene 3 usuarios. |
| 409 | `{"status":409,"message":"Este usuario ya tiene un usuario wifi asignado!"}` | El usuario ya tiene una cuenta vigente. |

---

### 8.8 Check-in (ingresos) — `/api/v1/checkin`

Objeto **Check-in** (respuesta). Atención: `id` es el **carnet del usuario**, no el id del registro.

```json
{ "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "date": "2026-11-20", "time": "23:48:17", "photo": null }
```

#### `POST /checkin/:identifier`

Registra el ingreso de un usuario a la biblioteca (lectura del carnet en el kiosco).

| | |
|---|---|
| Rol | `reception` |
| Parámetro de ruta | `identifier` — carnet del usuario |
| Body | Ninguno |

Respuesta `201 Created`:

```json
{
  "message": "Ingresado correctamente",
  "checkin": { "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "date": "2026-11-20", "time": "23:48:17", "photo": null }
}
```

Errores:

| Código | Cuerpo | Causa |
|--------|--------|-------|
| 404 | `{"status":404,"message":"Usuario no encontrado!"}` | Carnet inexistente. |
| 409 | `{"status":409,"message":"El usuario esta inactivo!"}` | Usuario `inactive`. |

---

#### `GET /checkin`

Historial paginado de ingresos, del más reciente al más antiguo.

| | |
|---|---|
| Rol | `reception` |

Query:

| Parámetro | Tipo | Regla |
|-----------|------|-------|
| `page`, `limit` | entero | Sección 7 |
| `date` | fecha ISO | Fecha exacta |
| `dateFrom`, `dateTo` | fecha ISO | Rango |
| `timeFrom`, `timeTo` | `HH:MM` | Rango de hora |
| `userId` | string | Carnet |

Respuesta `200 OK` (`GET /api/v1/checkin?userId=4-000124`):

```json
{
  "data": [
    { "id": "4-000124", "firstName": "Juan", "lastName": "Perez", "date": "2026-11-20", "time": "23:48:17", "photo": null }
  ],
  "pagination": { "total": 1, "limit": 10, "page": 1, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
}
```

Errores:

| Código | Cuerpo |
|--------|--------|
| 400 | `{"errors":[{"field":"date","message":"Fecha inválida"}]}` |
| 400 | `{"errors":[{"field":"timeTo","message":"Hora hasta inválida"}]}` |

---

### 8.9 Archivos estáticos — `/uploads`

`GET /uploads/<ruta>` sirve archivos guardados en `craisistem-backend/uploads/` (fotos de usuarios). Es público y está fuera de `/api/v1`. Las fotos que vienen de la API institucional son URLs absolutas y se devuelven tal cual.

---

## 9. Modelo de datos

```
user_data ──< user_x_role >── role
   │
   ├──< checkin
   │
   ├──< loan ──┬── loan_charge  (1:1, librarian_id → user_data)
   │           ├── loan_release (1:1, librarian_id → user_data)
   │           ├── loan_device  (1:1) ──> device
   │           └── loan_locker  (1:1) ──> locker
   │
   └──< wifi_assignment >── wifi_user
          (user_id, librarian_id)
```

| Tabla | Columnas principales |
|-------|----------------------|
| `user_data` | `id` (PK, varchar 15), `first_name`, `last_name`, `email`, `gender`, `type` (enum), `faculty`, `token`, `expiration_date`, `photo`, `state` (enum) |
| `role` | `id` (uuid), `name` (enum, único) |
| `user_x_role` | `user_id`, `role_id` |
| `device` | `id` (serial), `brand`, `state` (enum), `section`, `model`, `inventory`, `operatingSystem` (enum) |
| `locker` | `id` (serial), `state` (enum) |
| `loan` | `id` (uuid), `date`, `user_id` |
| `loan_charge` | `loan_id` + `librarian_id` (PK), `start_time` |
| `loan_release` | `loan_id` + `librarian_id` (PK), `end_time` |
| `loan_device` | `loan_id` + `device_id` (PK) |
| `loan_locker` | `loan_id` + `locker_id` (PK) |
| `checkin` | `id` (uuid), `date`, `time`, `user_id` |
| `wifi_user` | `id` (PK, varchar 8), `password`, `creation_date`, `expiration_date` |
| `wifi_assignment` | `id` (uuid), `timestamp`, `librarian_id`, `user_id`, `wifiUserId` |
| `complement` | Tabla preparada para accesorios de equipos (sin endpoints todavía). |

Un préstamo está **activo** mientras no tenga registro en `loan_release`.

---

## 10. Tareas programadas

Ambas usan la zona horaria `America/El_Salvador`.

| Tarea | Horario | Descripción |
|-------|---------|-------------|
| Sincronización de usuarios (`job/sync-manager.ts`) | Todos los días 00:00 | Consulta la API institucional (`/reporteSIU?reporte=10` estudiantes, `9` empleados, `8` PEC). Crea/actualiza usuarios con rol `user` (conservando los roles que ya tenían) y marca como `inactive` a los usuarios de ese tipo que ya no aparecen. Si una fuente no devuelve datos, se omite para no desactivar a todos. También se ejecuta con `PATCH /user/manual-fetch`. |
| Recordatorio por correo (`job/email-reminder.job.ts`) | Todos los días 06:58 | Envía un correo a cada usuario con un préstamo del día aún activo, usando la cuenta de Office 365 configurada. |

---

## 11. Resumen de endpoints

| # | Método | Ruta | Rol | Descripción |
|---|--------|------|-----|-------------|
| 1 | GET | `/auth/microsoft` | Pública | Inicia login Microsoft |
| 2 | GET | `/auth/microsoft/callback` | Pública | Retorno de Microsoft |
| 3 | POST | `/auth/login` | Pública | Login temporal por correo |
| 4 | POST | `/auth/register` | admin | Crear administrador |
| 5 | GET | `/auth/whoami` | Autenticado | Datos del usuario actual |
| 6 | GET | `/user` | librarian | Listar usuarios |
| 7 | GET | `/user/:identifier` | learningcenter / reception / librarian | Buscar usuario por carnet |
| 8 | POST | `/user` | librarian | Crear usuario externo |
| 9 | PATCH | `/user/:identifier/roles` | admin | Asignar rol |
| 10 | DELETE | `/user/:identifier/roles` | admin | Quitar rol |
| 11 | PATCH | `/user/manual-fetch` | admin | Sincronizar usuarios |
| 12 | POST | `/device` | admin | Registrar computadora |
| 13 | GET | `/device` | learningcenter | Listar computadoras |
| 14 | PUT | `/device/:identifier` | admin | Editar computadora |
| 15 | POST | `/device-loan/charge` | learningcenter | Prestar computadora |
| 16 | POST | `/device-loan/release/:identifier` | learningcenter | Finalizar préstamo de computadora |
| 17 | GET | `/device-loan` | learningcenter | Historial de préstamos de computadoras |
| 18 | GET | `/locker` | reception | Listar casilleros |
| 19 | POST | `/locker-loan/charge` | reception | Prestar casillero |
| 20 | POST | `/locker-loan/release/:identifier` | reception | Liberar casillero |
| 21 | GET | `/locker-loan` | reception | Historial de préstamos de casilleros |
| 22 | POST | `/wifi-user/import` | librarian | Cargar cuentas WiFi (CSV) |
| 23 | GET | `/wifi-user` | librarian | Listar cuentas WiFi |
| 24 | POST | `/wifi-user/assign` | librarian | Asignar cuenta WiFi |
| 25 | POST | `/checkin/:identifier` | reception | Registrar ingreso |
| 26 | GET | `/checkin` | reception | Historial de ingresos |
| 27 | GET | `/uploads/*` | Pública | Archivos estáticos (fotos) |
