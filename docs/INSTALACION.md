# Guía de instalación — CRAI Sistem

Esta guía explica cómo instalar el sistema en dos escenarios:

- **[Parte A — Instalación local para desarrollo](#parte-a--instalación-local-para-desarrollo)**: en la computadora de un desarrollador, para modificar y probar el código.
- **[Parte B — Instalación en servidor (producción con Docker)](#parte-b--instalación-en-servidor-producción-con-docker)**: en el servidor de la universidad, para el uso diario de la biblioteca.

Después de cualquiera de las dos, continúe con la [Parte C — Configuración inicial](#parte-c--configuración-inicial-después-de-instalar). La [Parte D](#parte-d--operación-y-mantenimiento) cubre actualizaciones y respaldos, y la [Parte E](#parte-e--solución-de-problemas) los problemas frecuentes.

| Componente | Tecnología | Puerto |
|------------|------------|--------|
| Base de datos | PostgreSQL 16 | 5432 |
| Backend (API) | Node.js 20 + Express + TypeORM | 5000 |
| Frontend | React + Vite (desarrollo) / Nginx (producción) | 5173 (dev) / 80 y 443 (prod) |

---

## Parte A — Instalación local para desarrollo

### A.1 Requisitos

| Programa | Versión | Descarga |
|----------|---------|----------|
| Git | Cualquiera reciente | https://git-scm.com |
| Node.js | 20 LTS o superior (incluye npm) | https://nodejs.org |
| PostgreSQL | 16 | https://www.postgresql.org/download |
| Editor (opcional) | Visual Studio Code | https://code.visualstudio.com |

Compruebe las versiones:

```bash
git --version
```

```bash
node --version
```

```bash
psql --version
```

> Alternativa sin instalar PostgreSQL: si tiene Docker Desktop, puede levantar solo la base de datos con
> `docker run -d --name crai-db -e POSTGRES_USER=crai -e POSTGRES_PASSWORD=crai -e POSTGRES_DB=crai -p 5432:5432 postgres:16-alpine`
> y saltar al paso A.4.

### A.2 Obtener el código

```bash
git clone https://github.com/Arguera123/Crai-Sistem.git
```

```bash
cd Crai-Sistem
```

```bash
git checkout login-correo
```

### A.3 Crear la base de datos

Abra la consola de PostgreSQL como administrador (en Windows: *SQL Shell (psql)*; en Linux: `sudo -u postgres psql`) y ejecute:

```sql
CREATE USER crai WITH PASSWORD 'crai';
CREATE DATABASE crai OWNER crai;
```

No hace falta crear tablas: el backend las crea automáticamente al iniciar.

### A.4 Configurar y arrancar el backend

1. Instale las dependencias:

   ```bash
   cd craisistem-backend
   ```

   ```bash
   npm install
   ```

2. Cree el archivo `craisistem-backend/.env` con este contenido (ajuste usuario y contraseña si usó otros):

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=crai
   DB_PASSWORD=crai
   DB_NAME=crai
   BACKEND_PORT=5000
   NODE_ENV=development
   TOKEN_SECRET=una-clave-de-desarrollo
   FRONTEND_URL=http://localhost:5173
   API_URL=http://localhost:5000
   ADMIN_EMAIL=admin@example.com
   ENABLE_EMAIL_LOGIN=true
   ```

   Las variables de Microsoft, de la API de la UCA y del correo son opcionales en desarrollo (sin ellas no funcionan el login con Microsoft, la sincronización de usuarios ni los recordatorios, pero el resto sí).

3. Inicie el servidor:

   ```bash
   npm run dev
   ```

   Debe ver en la consola:

   ```
   Base de datos conectada
   Roles seeded
   Usuario admin seed creado o actualizado
   140 lockers nuevos creados.
   Cron Job programado: Medianoche cada día.
   Servidor corriendo en http://localhost:5000
   ```

   Deje esta terminal abierta. `npm run dev` reinicia el servidor solo cuando se guarda un archivo.

### A.5 Configurar y arrancar el frontend

En **otra** terminal, desde la raíz del proyecto:

```bash
cd craisistem-frontend
```

```bash
npm install
```

Cree el archivo `craisistem-frontend/.env` con:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Inicie el frontend:

```bash
npm run dev
```

Abra **http://localhost:5173** en el navegador.

### A.6 Primer ingreso (desarrollo)

En la pantalla de inicio escriba `admin@example.com` (o el valor que puso en `ADMIN_EMAIL`) en *Correo Institucional* y pulse **Entrar temporal**. Entrará como administrador y verá todos los menús.

### A.7 Comandos útiles

| Carpeta | Comando | Para qué |
|---------|---------|----------|
| `craisistem-backend` | `npm run dev` | Servidor de desarrollo con recarga automática |
| `craisistem-backend` | `npm run build` | Compila TypeScript a `dist/` |
| `craisistem-backend` | `npm start` | Ejecuta la versión compilada (`dist/index.js`) |
| `craisistem-backend` | `npx tsc --noEmit` | Revisa errores de tipos sin compilar |
| `craisistem-frontend` | `npm run dev` | Servidor de desarrollo |
| `craisistem-frontend` | `npm run build` | Compila la versión de producción en `dist/` |
| `craisistem-frontend` | `npm run lint` | Revisa el estilo del código |

---

## Parte B — Instalación en servidor (producción con Docker)

El sistema se despliega con **Docker Compose** en tres contenedores:

| Contenedor | Imagen | Función |
|------------|--------|---------|
| `biblioteca_db` | `postgres:16-alpine` | Base de datos (datos guardados en el volumen `pgdata`) |
| `biblioteca_backend` | Construida desde `craisistem-backend/Dockerfile` | API en el puerto 5000 |
| `biblioteca_frontend` | Construida desde `craisistem-frontend/Dockerfile` | Nginx: sirve la web por HTTPS y reenvía `/api/` al backend |

### B.1 Requisitos del servidor

| Requisito | Recomendado |
|-----------|-------------|
| Sistema operativo | Ubuntu Server 22.04 / 24.04 LTS (cualquier Linux con Docker sirve) |
| Recursos | 2 vCPU, 4 GB de RAM, 20 GB de disco |
| Red | Puertos **80** y **443** abiertos hacia los usuarios |
| DNS | Un dominio apuntando a la IP del servidor (ej. `biblioteca.uca.edu.sv`) |
| Certificado SSL | Archivos `.crt` y `.key` para ese dominio (los entrega el área de TI, o puede usar Let's Encrypt, ver B.5) |
| Salida a Internet | Hacia la API institucional de la UCA, `login.microsoftonline.com` y `smtp.office365.com` |

### B.2 Instalar Docker

En Ubuntu:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

```bash
sudo usermod -aG docker $USER
```

Cierre la sesión SSH, vuelva a entrar y compruebe:

```bash
docker --version
```

```bash
docker compose version
```

### B.3 Obtener el código

```bash
cd /opt
```

```bash
sudo git clone https://github.com/Arguera123/Crai-Sistem.git crai
```

```bash
sudo chown -R $USER:$USER /opt/crai
```

```bash
cd /opt/crai
```

```bash
git checkout login-correo
```

> Use la rama que el equipo haya definido para producción (por ejemplo `main` una vez fusionados los cambios).

### B.4 Configurar las variables de entorno

```bash
cp .env.template .env
```

```bash
nano .env
```

Complete **como mínimo** estos valores:

| Variable | Qué poner |
|----------|-----------|
| `DB_HOST` | `db` (no cambiar: es el nombre del contenedor) |
| `DB_PASSWORD` | Una contraseña segura para la base de datos |
| `TOKEN_SECRET` | Una cadena aleatoria larga (ver comando abajo) |
| `ADMIN_EMAIL` | El correo institucional de la persona responsable del sistema |
| `FRONTEND_URL` | `https://<su-dominio>` |
| `API_URL` | `https://<su-dominio>/api` |
| `VITE_API_URL` | `https://<su-dominio>/api/v1` |
| `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_CALLBACK_URL` | Ver [C.2](#c2-configurar-el-inicio-de-sesión-con-microsoft) |
| `UCA_API`, `UCA_TOKEN` | Los entrega el área de TI de la UCA |
| `OUTLOOK_USER`, `OUTLOOK_PASSWORD` | Cuenta de correo que enviará los recordatorios |

Generar un `TOKEN_SECRET` aleatorio:

```bash
openssl rand -hex 48
```

Proteja el archivo:

```bash
chmod 600 .env
```

> ⚠️ Nunca suba el archivo `.env` al repositorio (ya está en `.gitignore`).

### B.5 Colocar el certificado SSL

Nginx espera exactamente estos dos archivos:

```
/opt/crai/certs/biblioteca.crt
/opt/crai/certs/biblioteca.key
```

```bash
mkdir -p certs
```

Copie ahí los archivos que le entregó TI con esos nombres. Si usa un dominio distinto de `biblioteca.uca.edu.sv`, edite también `server_name` en `craisistem-frontend/nginx.conf` (aparece dos veces).

**Opción con Let's Encrypt** (si el servidor es accesible desde Internet en el puerto 80 y aún no levantó los contenedores):

```bash
sudo apt install -y certbot
```

```bash
sudo certbot certonly --standalone -d biblioteca.uca.edu.sv
```

```bash
sudo cp /etc/letsencrypt/live/biblioteca.uca.edu.sv/fullchain.pem certs/biblioteca.crt
```

```bash
sudo cp /etc/letsencrypt/live/biblioteca.uca.edu.sv/privkey.pem certs/biblioteca.key
```

```bash
sudo chown $USER:$USER certs/*
```

### B.6 Construir y levantar los contenedores

```bash
docker compose up -d --build
```

La primera vez tarda varios minutos (descarga imágenes, instala dependencias y compila). Compruebe que los tres contenedores estén `Up`:

```bash
docker compose ps
```

Revise el log del backend; debe terminar en `Servidor corriendo en http://localhost:5000`:

```bash
docker compose logs -f backend
```

(Salga del log con `Ctrl + C`; los contenedores siguen funcionando.)

### B.7 Verificar la instalación

1. Abra `https://<su-dominio>` en el navegador: debe aparecer la pantalla de inicio de sesión.
2. Compruebe que la API responde a través de Nginx (debe devolver un error 401, lo cual es correcto porque no envió token):

   ```bash
   curl -k https://<su-dominio>/api/v1/auth/whoami
   ```

   Respuesta esperada: `{"status":401,"message":"Usuario no autenticado"}`.
   Si obtiene un 404 o una página HTML, revise la sección [Parte E — Solución de problemas](#parte-e--solución-de-problemas).
3. Inicie sesión con el correo puesto en `ADMIN_EMAIL` (botón *Entrar temporal*) o con Microsoft.

### B.8 Recomendación de seguridad: no exponer el puerto 5000

`docker-compose.yml` publica el backend en el puerto 5000 del servidor. Como Nginx ya lo alcanza por la red interna de Docker, se recomienda cerrar ese puerto con el firewall:

```bash
sudo ufw allow 22,80,443/tcp
```

```bash
sudo ufw enable
```

> Docker puede saltarse las reglas de `ufw` en los puertos que publica. La forma más segura es eliminar las líneas `ports: - "5000:5000"` del servicio `backend` en `docker-compose.yml`.

---

## Parte C — Configuración inicial (después de instalar)

### C.1 Crear las cuentas del personal

1. Ingrese como administrador.
2. Vaya a **Usuarios → Usuarios** y pulse **Sincronizar Usuarios** para traer estudiantes y empleados desde la base institucional (requiere `UCA_API` y `UCA_TOKEN`).
3. Busque a cada miembro del personal y, en la columna **Roles**, asígnele su rol:
   - `learningcenter` → personal del Learning Center.
   - `reception` → recepción (lockers y check-in).
   - `librarian` → bibliotecarios (usuarios y WiFi).
   - `admin` → responsables del sistema.

Detalles en el [Manual de usuario](MANUAL_USUARIO.md), secciones 9.3 y 9.4.

### C.2 Configurar el inicio de sesión con Microsoft

Lo realiza un administrador de Azure / Microsoft Entra ID de la universidad:

1. Entre a https://entra.microsoft.com → **Aplicaciones** → **Registros de aplicaciones** → **Nuevo registro**.
2. Nombre: `CRAI Sistem`. Tipos de cuenta: *Solo cuentas de este directorio organizativo*.
3. **URI de redirección** (tipo *Web*):
   `https://<su-dominio>/api/v1/auth/microsoft/callback`
4. Al crear la aplicación, copie:
   - *Id. de aplicación (cliente)* → `MICROSOFT_CLIENT_ID`
   - *Id. de directorio (inquilino)* → `MICROSOFT_TENANT`
5. En **Certificados y secretos** → **Nuevo secreto de cliente**; copie el *Valor* → `MICROSOFT_CLIENT_SECRET` (anote su fecha de vencimiento: al vencer, el login con Microsoft dejará de funcionar).
6. En **Permisos de API** confirme que está `Microsoft Graph → User.Read` (delegado).
7. Ponga en `.env`:

   ```env
   MICROSOFT_CLIENT_ID=<id de aplicación>
   MICROSOFT_CLIENT_SECRET=<valor del secreto>
   MICROSOFT_TENANT=<id de inquilino>
   MICROSOFT_CALLBACK_URL=https://<su-dominio>/api/v1/auth/microsoft/callback
   ```

8. Reinicie el backend:

   ```bash
   docker compose up -d backend
   ```

9. Pruebe el botón **Iniciar sesión con Microsoft**. Cuando funcione, desactive el inicio temporal por correo poniendo `ENABLE_EMAIL_LOGIN=false` en `.env` y reinicie el backend con el mismo comando.

> Una persona solo puede entrar si su correo de Microsoft coincide con el correo registrado en el sistema y tiene un rol distinto de `user`.

### C.3 Lista de verificación final

- [ ] `TOKEN_SECRET` con un valor aleatorio (no vacío).
- [ ] `ADMIN_EMAIL` con un correo institucional real.
- [ ] `DB_PASSWORD` cambiado respecto a la plantilla.
- [ ] El sitio abre por HTTPS y `/api/v1/auth/whoami` responde 401.
- [ ] Sincronización de usuarios probada.
- [ ] Personal con sus roles asignados.
- [ ] Inicio de sesión con Microsoft funcionando.
- [ ] `ENABLE_EMAIL_LOGIN=false`.
- [ ] Puerto 5000 cerrado al exterior.
- [ ] Respaldo automático de la base de datos configurado (D.2).

---

## Parte D — Operación y mantenimiento

### D.1 Actualizar el sistema a una nueva versión

```bash
cd /opt/crai
```

```bash
git pull
```

```bash
docker compose up -d --build
```

Los datos no se pierden: están en el volumen `pgdata`. **Haga un respaldo antes de actualizar** (D.2), porque el backend ajusta las tablas automáticamente al iniciar.

### D.2 Respaldo y restauración de la base de datos

Crear un respaldo (usa los valores de su `.env`; aquí con los de la plantilla):

```bash
docker exec biblioteca_db pg_dump -U biblioteca_admin biblioteca_db > respaldo_$(date +%F).sql
```

Restaurar un respaldo:

```bash
cat respaldo_2026-11-21.sql | docker exec -i biblioteca_db psql -U biblioteca_admin -d biblioteca_db
```

Respaldo automático diario a las 2:00 a. m. (abra el editor con `crontab -e` y agregue la línea):

```
0 2 * * * docker exec biblioteca_db pg_dump -U biblioteca_admin biblioteca_db > /opt/crai/respaldos/crai_$(date +\%F).sql
```

(Cree antes la carpeta con `mkdir -p /opt/crai/respaldos` y copie periódicamente los respaldos a otro equipo.)

### D.3 Comandos de operación

| Acción | Comando |
|--------|---------|
| Ver estado | `docker compose ps` |
| Ver logs del backend | `docker compose logs -f backend` |
| Ver logs de Nginx | `docker compose logs -f frontend` |
| Reiniciar solo el backend (p. ej. tras cambiar `.env`) | `docker compose up -d backend` |
| Detener todo | `docker compose down` |
| Iniciar todo | `docker compose up -d` |
| Entrar a la base de datos | `docker exec -it biblioteca_db psql -U biblioteca_admin -d biblioteca_db` |

> ⚠️ **Nunca** ejecute `docker compose down -v`: la opción `-v` borra el volumen `pgdata` con **todos los datos**.

> Cambiar `VITE_API_URL` requiere reconstruir el frontend: `docker compose up -d --build frontend`.

### D.4 Renovar el certificado SSL

Reemplace los archivos de `certs/` y reinicie Nginx:

```bash
docker compose restart frontend
```

Con Let's Encrypt (cada 90 días): detenga el frontend, renueve y copie de nuevo los archivos como en B.5:

```bash
docker compose stop frontend
```

```bash
sudo certbot renew
```

---

## Parte E — Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `docker compose ps` muestra el backend reiniciándose | Error al conectar con la base o variable faltante | `docker compose logs backend`. Verifique `DB_HOST=db` y que `DB_USERNAME`/`DB_PASSWORD`/`DB_NAME` coincidan. |
| Log: `password authentication failed` | Se cambió `DB_PASSWORD` después de crear el volumen | La contraseña solo se fija la primera vez. Restaure la original en `.env` o cámbiela dentro de PostgreSQL con `ALTER USER`. |
| El contenedor `frontend` no arranca; log: `cannot load certificate` | Faltan `certs/biblioteca.crt` o `certs/biblioteca.key` | Revise B.5 (nombres exactos). |
| La web carga pero todo da error / 404 en `/api/...` | `VITE_API_URL` incorrecta | Debe ser `https://<dominio>/api/v1`. Corrija y reconstruya: `docker compose up -d --build frontend`. |
| Error de CORS en la consola del navegador | `FRONTEND_URL` no coincide con la dirección real | Ponga exactamente `https://<dominio>` (sin `/` final) y reinicie el backend. |
| Microsoft muestra `AADSTS50011` (*redirect URI mismatch*) | La URL de retorno no coincide | Debe ser idéntica en Azure y en `MICROSOFT_CALLBACK_URL`. |
| Tras login con Microsoft: *El usuario no se encuentra registrado* | El correo no existe en el sistema | Sincronice usuarios o regístrelo; verifique que el correo sea el mismo. |
| Tras login: *El usuario no tiene permisos* | Solo tiene rol `user` | Asigne un rol desde Usuarios. |
| La sincronización no trae usuarios | `UCA_API`/`UCA_TOKEN` vacíos o sin salida de red | Revise el log: `Error obteniendo Alumnos: ...`. |
| No llegan los recordatorios por correo | Credenciales de Outlook o SMTP bloqueado | Log: `Error al mandar los emails`. La cuenta debe permitir *SMTP AUTH* en Office 365. |
| Log: `[jwt] TOKEN_SECRET no esta definido` | Falta `TOKEN_SECRET` | Complételo y reinicie el backend. |
| En desarrollo: `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL no está iniciado | Inicie el servicio de PostgreSQL o el contenedor `crai-db`. |
| En desarrollo: puerto 5000 o 5173 ocupado | Otro programa usa el puerto | Cambie `BACKEND_PORT` (y `VITE_API_URL`) o cierre el otro programa. |

---

Documentos relacionados: [Documentación técnica de la API](API.md) · [Manual de usuario](MANUAL_USUARIO.md) · [Correcciones](CORRECCIONES.md)
