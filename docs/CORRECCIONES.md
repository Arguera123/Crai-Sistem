# Revisión del sistema: correcciones aplicadas y recomendaciones

Revisión completa del backend y frontend realizada en la rama `login-correo`. Cada corrección se verificó levantando el backend contra PostgreSQL 16, probando los endpoints con peticiones reales y navegando el frontend en un navegador.

Severidad: 🔴 crítica · 🟠 alta · 🟡 media · 🟢 baja

---

## 1. Correcciones aplicadas

### Seguridad

| # | Sev. | Problema | Corrección | Archivos |
|---|------|----------|------------|----------|
| 1 | 🔴 | `POST /auth/register` era **público** y creaba usuarios con rol **admin**: cualquier persona podía hacerse administradora. | Ahora requiere estar autenticado como `admin`, y valida el body. | `routers/auth.router.ts`, `validators/auth.validator.ts` |
| 2 | 🔴 | En Docker el backend **no recibía** `TOKEN_SECRET`, `MICROSOFT_*`, `UCA_API`, `UCA_TOKEN` ni `API_URL` (no estaban en `docker-compose.yml`). Los JWT se firmaban con el secreto por defecto `'Super Secret Value'`, que está en el código público, por lo que **cualquiera podía falsificar un token**. | `env_file: .env` en el servicio backend, plantilla `.env.template` completa y advertencia en consola si falta `TOKEN_SECRET`. | `docker-compose.yml`, `.env.template`, `utils/jwt.ts` |
| 3 | 🟠 | `PUT /device/:id` copiaba **cualquier** campo del body a la entidad (por ejemplo, `id`). | Solo se aceptan `brand`, `state`, `section`, `model`, `inventory`, `operatingSystem`. | `services/device.service.ts` |
| 4 | 🟡 | El login temporal por correo no se podía desactivar y dejaba entrar a usuarios con solo el rol `user`. | Variable `ENABLE_EMAIL_LOGIN=false` lo desactiva; ahora exige un rol de trabajo (igual que Microsoft). | `services/auth.service.ts` |
| 5 | 🟡 | El correo del admin inicial (`admin@example.com`) estaba fijo en el código. | Configurable con `ADMIN_ID` / `ADMIN_EMAIL`. | `utils/admin-user.seed.ts` |
| 6 | 🟢 | `TOKEN_EXP` se leía pero se ignoraba (siempre `1d`). | Se usa el valor configurado. | `utils/jwt.ts` |

### Despliegue

| # | Sev. | Problema | Corrección | Archivos |
|---|------|----------|------------|----------|
| 7 | 🔴 | Con `NODE_ENV=production` (valor de la plantilla y del Dockerfile) TypeORM buscaba las entidades en `src/models/**/*.ts`, que **no existe** en la imagen: el backend no podía arrancar. Solo funcionaba con `NODE_ENV=prod`. | Las rutas de entidades se resuelven relativas al archivo compilado. Verificado ejecutando `dist/index.js` con `NODE_ENV=production`. | `configs/db.config.ts` |
| 8 | 🔴 | Nginx tenía `proxy_pass http://backend:5000/;` (con barra final): recortaba `/api` y el backend recibía `/v1/...`, por lo que **todas las peticiones daban 404**. | `proxy_pass http://backend:5000;` conserva la ruta `/api/v1/...`. | `craisistem-frontend/nginx.conf` |
| 9 | 🟠 | La plantilla `.env.template` no coincidía con lo que lee el código: `DB_USER` en vez de `DB_USERNAME`, `MICROSOFT_REDIRECT_URI` en vez de `MICROSOFT_CALLBACK_URL`, `VITE_API_URL` sin `/v1`, y faltaban `DB_HOST`, `FRONTEND_URL`, `TOKEN_SECRET`, `UCA_*`, `OUTLOOK_*`, `API_URL`. | Plantilla reescrita y documentada. | `.env.template` |
| 10 | 🟡 | La carga de CSV guardaba archivos en `src/uploads/` (no existe en la imagen de producción). | Se usa el directorio temporal del sistema y límite de 5 MB. | `middlewares/multer.middleware.ts` |
| 11 | 🟢 | `utils/saveBase64Image.ts` importaba el paquete `uuid`, que no es dependencia directa (se cargaba de rebote vía TypeORM). | Se usa `crypto.randomUUID`; se quitaron imports no usados. | `utils/saveBase64Image.ts`, `mappers/*` |

### Lógica de negocio

| # | Sev. | Problema | Corrección | Archivos |
|---|------|----------|------------|----------|
| 12 | 🔴 | La **sincronización nocturna reemplazaba los roles** de cada usuario por `[user]`: un empleado con rol `librarian`/`reception`/`admin` **perdía sus permisos cada noche**. | Se conservan los roles existentes y solo se agrega `user` si falta. Verificado: el admin conserva `admin` tras sincronizar. | `services/sync.service.ts` |
| 13 | 🔴 | Si la API institucional fallaba, devolvía una lista vacía y la sincronización **marcaba como inactivos a TODOS** los usuarios de ese tipo (nadie podía recibir préstamos). Además, para empleados se usaba `item.iduser` (no existe; el campo es `idusr`). | Si una fuente no devuelve datos se omite; se usa `idusr`; los registros mal formados se saltan. | `services/sync.service.ts` |
| 14 | 🔴 | La verificación de "préstamo de casillero activo" buscaba préstamos de **computadora**: un usuario podía tomar varios casilleros, y quien tenía una computadora no podía tomar casillero. | Se consulta `loanLocker`. | `repository/loan.repository.ts` |
| 15 | 🟠 | `POST /device` no esperaba (`await`) el guardado: respondía "registrado" aunque fallara, y el error quedaba sin manejar. Además no validaba `operatingSystem` (columna obligatoria). | `await`, código 201 y validación de `operatingSystem`. | `controllers/device.controller.ts`, `validators/device.validator.ts` |
| 16 | 🟠 | `POST /auth/register` **siempre fallaba con 500** (no asignaba `faculty`, columna obligatoria). | Se asigna `N/A`. | `services/auth.service.ts` |
| 17 | 🟠 | Liberar un préstamo de casillero con la ruta de computadoras (o al revés) provocaba un error 500. | Responde 400 *"El prestamo indicado no corresponde a …"*. | `services/loan-device.service.ts`, `services/loan-locker.service.ts` |
| 18 | 🟠 | Los check-in guardaban fecha/hora con el reloj de PostgreSQL (UTC en Docker): un ingreso a las 6 p. m. quedaba registrado al día siguiente a las 00:00. Los préstamos sí usaban hora de El Salvador. | Fecha y hora de El Salvador, formato `HH:MM:SS`. También para el check-in automático del préstamo de casillero. | `services/checkin.service.ts`, `services/loan-locker.service.ts` |
| 19 | 🟠 | Los cron jobs usaban la hora del servidor (UTC): la sincronización "de medianoche" corría a las 6 p. m. y el recordatorio "de las 6:58" a las 0:58 a. m. | `timezone: "America/El_Salvador"`. | `job/*.ts` |
| 20 | 🟠 | El recordatorio por correo usaba `where: { release: false }` (condición no válida para una relación en TypeORM) y la fecha en UTC. | Consulta con `LEFT JOIN` y `release IS NULL`, fecha local. | `repository/loan.repository.ts`, `services/reminder.service.ts` |
| 21 | 🟠 | `GET /user/:id` exigía el rol `learningcenter`, pero también lo usan Recepción (préstamo de locker) y Bibliotecario (asignar WiFi): sin ser admin **no podían confirmar** préstamos de casillero ni asignaciones WiFi. | La autorización acepta varios roles; esta ruta permite los tres. | `middlewares/auth.middleware.ts`, `routers/user.router.ts` |
| 22 | 🟡 | `GET /user/:id` con un carnet inexistente daba 500. | 404 *"Usuario no encontrado"*. | `services/user.service.ts` |
| 23 | 🟡 | Asignar un rol que el usuario ya tenía daba 500 (clave duplicada). | 409 *"El usuario ya posee este rol"*. | `services/user.service.ts` |
| 24 | 🟡 | `POST /user` no validaba nada: datos incompletos daban 500. Tampoco verificaba correos duplicados. | Validación completa y 409 por correo duplicado. | `routers/user.router.ts`, `services/user.service.ts` |
| 25 | 🟡 | Mensaje invertido: *"El usuario no esta inactivo!"* cuando el usuario **sí** estaba inactivo. | *"El usuario esta inactivo!"*. | servicios de préstamo y check-in |
| 26 | 🟢 | `LockerService.findById` se llamaba a sí mismo (recursión infinita) y `LockerController.save` nunca respondía. | Corregidos (no se usan en rutas actualmente). | `services/locker.service.ts`, `controllers/locker.controller.ts` |
| 27 | 🟢 | `PATCH /user/manual-fetch` no tenía manejo de errores. | `try/catch` + `next(err)`. | `controllers/user.controller.ts` |
| 28 | 🟢 | `POST /wifi-user/assign` no validaba el body; el CSV aceptaba filas vacías o ids de más de 8 caracteres (error 500). | Validación del body y de las filas del CSV. | `validators/loan.validator.ts`, `services/wifi-user.service.ts` |

### Filtros y validaciones

| # | Sev. | Problema | Corrección |
|---|------|----------|------------|
| 29 | 🟠 | Filtro de dispositivos por inventario usaba la columna `device.inventary` (no existe) → error 500. El frontend además enviaba `inventary`. | Columna `inventory` en backend y frontend. |
| 30 | 🟡 | Filtros `dateFrom`/`dateTo` de préstamos se validaban pero **no se aplicaban**. | Agregados a la consulta. |
| 31 | 🟡 | Ordenar préstamos por `device` usaba `device.name` (no existe) → 500. | `device.id`; nuevo orden `locker`. |
| 32 | 🟡 | El orden de usuarios (`order`) se ignoraba y `active` apuntaba a una columna inexistente. | Se aplica; campo `state`. |
| 33 | 🟡 | El filtro `section` de dispositivos no se aplicaba. | Agregado. |
| 34 | 🟡 | En check-in: el validador de `timeTo` validaba `timeFrom` dos veces, no se usaba en la ruta, y el filtro `userId` se ignoraba; sin orden. | Validador corregido y aplicado, filtro `userId`, orden más reciente primero. |
| 35 | 🟡 | `limit` exigía mínimo 10 (el mensaje decía 1–100). | 1 a 200. |
| 36 | 🟢 | Los errores de validación repetían varios mensajes por campo. | Solo el primer error por campo. |
| 37 | 🟢 | Fotos: si un usuario no tenía foto se devolvía `"http://localhost:8080undefined"`; las fotos con URL absoluta (API institucional) se rompían al anteponer `API_URL`. | `utils/photo-url.ts` centraliza la lógica; devuelve `null` si no hay foto. |
| 38 | 🟢 | Mensajes mixtos inglés/español y erratas (*"servior"*, *"Usuario no autenticado D"*, *"romoved"*, *"entontrado"*). | Mensajes en español. |

### Frontend

| # | Sev. | Problema | Corrección | Archivos |
|---|------|----------|------------|----------|
| 39 | 🔴 | Un usuario sin rol `learningcenter` (p. ej. solo Recepción o Bibliotecario) quedaba en un **ciclo infinito de redirecciones** al iniciar sesión (`/` → `/learning-center/prestamos` → `/`). | `HomeRedirect` envía a la primera pantalla permitida según los roles. Verificado en navegador. | `components/ProtectedRoute.tsx`, `router/AppRouter.tsx`, `hooks/useLogin.ts`, `views/Login.view.tsx` |
| 40 | 🟠 | Los préstamos activos se pedían con el límite por defecto (10): con más de 10 casilleros ocupados, **no se podía liberar** un casillero (*"No se encontró un préstamo activo para este locker"*) y en Learning Center no se veían todas las sesiones. | Se piden hasta 200. | `services/DeviceLoanService.ts`, `services/LockerLoanService.ts` |
| 41 | 🟠 | La asignación WiFi "tragaba" los errores: si el backend respondía 409 el diálogo se cerraba como si hubiera funcionado. | Se propaga el error y se muestra el mensaje del backend. | `services/WifiService.ts`, `components/WifiAssignDialog.tsx`, `components/LockerLoanDialog.tsx` |
| 42 | 🟡 | Crear usuario o equipo no mostraba éxito ni error; el modal de nuevo equipo no se cerraba. | Notificaciones y cierre del modal. | `hooks/useUsers.ts`, `hooks/useManipulateDevice.ts`, `components/Tables/DeviceTable.tsx` |
| 43 | 🟡 | Filtro "Tipo de usuario": las opciones *Cortesía*, *Hijos de Empleados* e *Investigador 1 Mes* tenían los códigos intercambiados (8/9/17). | Códigos correctos. | `config/UserFilters.config.ts` |
| 44 | 🟡 | No existía la opción de estado *Mantenimiento* en el formulario ni en el filtro de equipos, y se mostraba como "Ocupado". | Agregada. | `EditDeviceModal.tsx`, `device.columns.tsx`, `DeviceFilters.config.ts` |
| 45 | 🟢 | La carga de CSV usaba `alert()` sin el resumen del backend. | Notificación con *"N usuarios insertados, M omitidos"*. | `hooks/useWifiUser.ts` |
| 46 | 🟢 | Ruta `/lockers/manage` mostraba el inventario de computadoras (no enlazada en el menú). | Eliminada. | `router/AppRouter.tsx` |

---

## 2. Recomendaciones pendientes (no aplicadas)

Estas requieren una decisión del equipo o cambios mayores.

| # | Sev. | Recomendación |
|---|------|---------------|
| A | 🔴 | **Desactivar el inicio de sesión solo con correo en producción** (`ENABLE_EMAIL_LOGIN=false`) en cuanto Microsoft esté configurado, y quitar la sección marcada como *"TEMPORAL"* en `views/Login.view.tsx`. Hoy, cualquiera que conozca el correo de un empleado con rol puede entrar como esa persona, sin contraseña. |
| B | 🔴 | Definir `ADMIN_EMAIL` con un correo institucional real y `TOKEN_SECRET` con un valor aleatorio largo antes de desplegar. Con el login por correo activo y el admin por defecto `admin@example.com`, cualquiera puede ser administrador. |
| C | 🟠 | `synchronize: true` en TypeORM modifica el esquema automáticamente al arrancar; en producción puede **borrar columnas/datos** si cambia una entidad. Usar migraciones (`typeorm migration:generate`). |
| D | 🟠 | Crear un préstamo hace 4–5 escrituras sin transacción: si una falla, quedan registros a medias (p. ej. préstamo sin `loan_charge`, que no aparece como activo). Además dos personas podrían prestar el mismo equipo al mismo tiempo. Envolver en `dataSource.transaction()` y bloquear la fila del recurso. |
| E | 🟠 | No hay pruebas automatizadas (`npm test` no hace nada). Sugerido: Jest + Supertest para los endpoints de préstamo. |
| F | 🟡 | La sincronización marca como inactivos a los usuarios de tipo `employee`/`student`/`xpec` que no estén en la API institucional, incluidos administradores creados con `POST /auth/register` y tipo `employee`. Usar el carnet real del empleado o un tipo distinto para cuentas manuales. (El login no verifica el estado, así que siguen pudiendo entrar.) |
| G | 🟡 | Las contraseñas WiFi se guardan y muestran en texto plano a todo bibliotecario (es necesario para entregarlas, pero conviene ocultarlas por defecto en la tabla). |
| H | 🟡 | La carpeta `craisistem-backend/uploads/users/` contiene fotos versionadas en Git. Si son de personas reales, retirarlas del repositorio y agregar `uploads/` al `.gitignore`. |
| I | 🟡 | El recordatorio dice "antes de las 6:00 p. m." pero se envía a las 6:58 a. m.; confirmar el horario deseado (`job/email-reminder.job.ts`). |
| J | 🟢 | En Learning Center solo se listan los primeros 40 equipos disponibles (`useActiveDevice(1, 40)`). |
| K | 🟢 | Código sin uso: entidad `Complement`, `WifiUserService.delete`, `WifiUserController.deleteAssign`, vistas `Admin`, `Stats`, `Querys`, `LockerLoan`, `hooks/useManualFetch.tsx`, `components/Tables/WifiUserTable.tsx` (vacíos). |
| L | 🟢 | El token JWT viaja en la URL (`/login?token=...`) al volver de Microsoft y se guarda en `localStorage`. Es funcional; una mejora sería usar una cookie `HttpOnly`. |
| M | 🟢 | El bundle del frontend pesa ~1 MB; se puede dividir por rutas con `React.lazy`. |
