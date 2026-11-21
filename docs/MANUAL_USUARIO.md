# Manual de usuario — CRAI Sistema

**Biblioteca P. Florentino Idoate S.J. — Gestión de Biblioteca y Centro de Aprendizaje**

Este manual explica cómo usar el sistema web del CRAI para:

- Prestar y recibir **computadoras** del Learning Center.
- Prestar y liberar **casilleros (lockers)**.
- Registrar el **ingreso (check-in)** de usuarios a la biblioteca.
- Administrar **usuarios**, sus **roles** y las **cuentas WiFi**.

---

## Cómo usar las marcas de captura de pantalla

En cada sección aparece un recuadro como este:

> 📷 **CAPTURA 01 — Pantalla de inicio de sesión**
> - **Dónde:** `https://<dominio>/login`
> - **Qué mostrar:** …
> - **Guardar como:** `docs/img/01-login.png`

Para completar el manual:

1. Abra el sistema en un navegador de escritorio (recomendado: Chrome, ventana de 1366×768 o mayor, zoom 100 %).
2. Inicie sesión con un usuario **administrador** (ve todos los menús) salvo que la captura indique otro rol.
3. Prepare los datos indicados en "Qué mostrar" (por ejemplo, tener al menos un préstamo activo).
4. Tome la captura (Windows: `Win + Shift + S`; macOS: `Cmd + Shift + 4`).
5. Guárdela en la carpeta `docs/img/` con el nombre indicado y reemplace el recuadro por:
   `![Descripción](img/01-login.png)`

> **Privacidad:** use datos de prueba o difumine nombres, carnés, correos, fotos y contraseñas WiFi reales antes de publicar el manual.

Al final del documento hay una [lista de verificación de todas las capturas](#anexo-a-lista-de-capturas).

---

## Índice

1. [Requisitos y acceso](#1-requisitos-y-acceso)
2. [Roles: qué puede hacer cada usuario](#2-roles-qué-puede-hacer-cada-usuario)
3. [Iniciar y cerrar sesión](#3-iniciar-y-cerrar-sesión)
4. [La barra de navegación](#4-la-barra-de-navegación)
5. [Uso de tablas: filtros y paginación](#5-uso-de-tablas-filtros-y-paginación)
6. [Learning Center (computadoras)](#6-learning-center-computadoras)
7. [Lockers (casilleros)](#7-lockers-casilleros)
8. [Check-in (registro de ingresos)](#8-check-in-registro-de-ingresos)
9. [Usuarios](#9-usuarios)
10. [Cuentas WiFi](#10-cuentas-wifi)
11. [Mensajes frecuentes y cómo resolverlos](#11-mensajes-frecuentes-y-cómo-resolverlos)
12. [Preguntas frecuentes](#12-preguntas-frecuentes)
- [Anexo A: Lista de capturas](#anexo-a-lista-de-capturas)

---

## 1. Requisitos y acceso

| Requisito | Detalle |
|-----------|---------|
| Navegador | Google Chrome, Microsoft Edge o Firefox actualizados. |
| Dirección | `https://biblioteca.uca.edu.sv` (o la que indique el área de TI). |
| Cuenta | Correo institucional registrado en el sistema **y** al menos un rol de trabajo asignado por un administrador (ver sección 2). |
| Lector de carnés (opcional) | Lector de código de barras USB/Bluetooth para el check-in y los préstamos. Funciona como un teclado. |

---

## 2. Roles: qué puede hacer cada usuario

Los menús que ve cada persona dependen de sus roles. Un usuario puede tener varios.

| Rol | Menús visibles | Funciones |
|-----|----------------|-----------|
| **Administrador** (`admin`) | Todos | Todo lo de los demás roles, además de: registrar y editar computadoras, asignar/quitar roles y sincronizar usuarios con la base institucional. |
| **Learning Center** (`learningcenter`) | Learning center | Prestar y recibir computadoras, ver el inventario y el historial de préstamos de computadoras. |
| **Recepción** (`reception`) | Lockers, Checkin | Prestar y liberar casilleros, registrar ingresos y consultar sus historiales. |
| **Bibliotecario** (`librarian`) | Usuarios | Consultar y crear usuarios, cargar cuentas WiFi y asignarlas. |
| **Usuario** (`user`) | — | Rol base de estudiantes, empleados y visitantes. **No permite entrar** al sistema; sirve para que puedan recibir préstamos. |

Al iniciar sesión, el sistema abre automáticamente la primera pantalla permitida: Learning Center → Lockers → Usuarios, según los roles.

---

## 3. Iniciar y cerrar sesión

### 3.1 Iniciar sesión con Microsoft (recomendado)

1. Abra la dirección del sistema. Si no tiene sesión, verá la pantalla de inicio.
2. Haga clic en **Iniciar sesión con Microsoft**.
3. Elija su cuenta institucional e ingrese su contraseña en la página de Microsoft.
4. Será devuelto al sistema y se abrirá su pantalla principal.

> 📷 **CAPTURA 01 — Pantalla de inicio de sesión**
> - **Dónde:** `/login`, sin sesión iniciada.
> - **Qué mostrar:** la pantalla completa: logo, título "CRAI Sistema", campo "Correo Institucional", botón "Entrar temporal" y botón "Iniciar sesión con Microsoft".
> - **Guardar como:** `docs/img/01-login.png`

> 📷 **CAPTURA 02 — Selección de cuenta de Microsoft**
> - **Dónde:** página de Microsoft que se abre al pulsar "Iniciar sesión con Microsoft".
> - **Qué mostrar:** el selector de cuentas (difumine el correo).
> - **Guardar como:** `docs/img/02-login-microsoft.png`

### 3.2 Inicio de sesión temporal con correo

Mientras el inicio con Microsoft no esté habilitado, puede escribir su **correo institucional** en el campo *Correo Institucional* y pulsar **Entrar temporal**.

> Esta opción puede ser desactivada por el administrador. Si aparece el mensaje *"El inicio de sesion por correo esta deshabilitado"*, use Microsoft.

### 3.3 Errores al iniciar sesión

Los errores aparecen en una notificación roja en la esquina superior derecha.

| Mensaje | Qué significa | Qué hacer |
|---------|---------------|-----------|
| *Correo no registrado* / *El usuario no se encuentra registrado en el sistema.* | Su correo no existe en el sistema. | Pida a un administrador que lo registre o que sincronice usuarios. |
| *El usuario no tiene permisos para acceder al sistema* | Solo tiene el rol `user`. | Pida a un administrador que le asigne un rol de trabajo. |

> 📷 **CAPTURA 03 — Error de inicio de sesión**
> - **Dónde:** `/login`.
> - **Qué mostrar:** escriba un correo no registrado y pulse "Entrar temporal"; capture la notificación roja *"Correo no registrado"*.
> - **Guardar como:** `docs/img/03-login-error.png`

### 3.4 Cerrar sesión

Pulse **Cerrar Sesión** (texto rojo, esquina superior derecha). La sesión también se cierra sola al vencer (por defecto, 24 horas); en ese caso el sistema lo regresará a la pantalla de inicio.

---

## 4. La barra de navegación

En la parte superior de todas las pantallas se encuentra la barra azul con:

1. **Logo** de la biblioteca: lleva a la pantalla principal.
2. **Menús** (aparecen según sus roles). Pase el cursor sobre cada menú para desplegar sus opciones:
   - **Usuarios** → *Usuarios* (manejo de usuarios), *Usuarios Wifi*.
   - **Learning center** → *Dispositivos* (inventario), *Prestamos*, *Consultas*.
   - **Lockers** → *Prestamos*, *Consultas*.
   - **Checkin** → *Checkin* (registrar ingresos), *Consultas*.
3. **Sus roles y su nombre**.
4. Botón **Cerrar Sesión**.

> 📷 **CAPTURA 04 — Barra de navegación con un menú desplegado**
> - **Dónde:** cualquier pantalla, con sesión de administrador.
> - **Qué mostrar:** pase el cursor sobre "Learning center" para que se vea el menú desplegado con sus tres opciones; que se vean también el nombre/rol y "Cerrar Sesión".
> - **Guardar como:** `docs/img/04-navbar.png`

---

## 5. Uso de tablas: filtros y paginación

Las pantallas de consulta (historiales, usuarios, dispositivos, WiFi) comparten el mismo funcionamiento.

**Agregar un filtro**

1. Pulse el botón **+ Filtros** (borde punteado) sobre la tabla.
2. Elija el filtro de la lista (por ejemplo *Fecha desde*, *Carnet de Usuario*).
3. Escriba o seleccione el valor. La tabla se actualiza sola después de un instante.
4. Puede agregar varios filtros; se combinan entre sí.
5. Para quitar un filtro, pulse la **X** que aparece junto a él.

**Paginación** (parte inferior de la tabla)

- *Filas por página*: cambia cuántos registros se ven.
- Flechas **<** y **>**: página anterior / siguiente.
- Mientras se cargan datos aparece la etiqueta *Cargando…* o *Sincronizando…*.

> 📷 **CAPTURA 05 — Filtros de una tabla**
> - **Dónde:** `/learning-center/tabla` (Learning center → Consultas).
> - **Qué mostrar:** el menú de "+ Filtros" abierto mostrando la lista de filtros disponibles.
> - **Guardar como:** `docs/img/05-filtros-menu.png`

> 📷 **CAPTURA 06 — Filtros aplicados y paginación**
> - **Dónde:** la misma pantalla.
> - **Qué mostrar:** dos filtros aplicados (p. ej. *Fecha desde* y *¿Devuelto? = No*) y la barra de paginación inferior.
> - **Guardar como:** `docs/img/06-filtros-aplicados.png`

---

## 6. Learning Center (computadoras)

*Rol requerido: Learning Center o Administrador.*

### 6.1 Prestar una computadora

Menú **Learning center → Prestamos** (`/learning-center/prestamos`).

1. En el panel **Nuevo Préstamo**, escriba o escanee el **Número de Carnet** del estudiante.
   - Al completar el carnet (mínimo 8 caracteres) se mostrará su nombre y foto en la tarjeta de la derecha.
2. En **Seleccionar Dispositivo**, elija el equipo. Solo aparecen equipos **disponibles**; cada uno muestra el ícono de su sistema operativo (Windows, macOS, Linux).
3. Verifique en la tarjeta de vista previa que el estudiante y el equipo sean correctos.
4. Pulse **Iniciar**. Aparecerá *"¡Dispositivo asignado con éxito!"* y el préstamo se agregará a **Sesiones Activas**.
5. Para limpiar el formulario sin prestar, pulse **X** (Cancelar).

> 📷 **CAPTURA 07 — Formulario de nuevo préstamo de computadora**
> - **Dónde:** `/learning-center/prestamos`.
> - **Qué mostrar:** un carnet válido escrito, un equipo seleccionado y la tarjeta de vista previa con nombre/foto del estudiante y el botón "Iniciar" habilitado.
> - **Guardar como:** `docs/img/07-lc-nuevo-prestamo.png`

> 📷 **CAPTURA 08 — Lista desplegable de dispositivos**
> - **Dónde:** misma pantalla.
> - **Qué mostrar:** el selector "Seleccionar Dispositivo" abierto con varios equipos y sus íconos de sistema operativo.
> - **Guardar como:** `docs/img/08-lc-seleccion-equipo.png`

**El sistema no permitirá el préstamo si:**

| Mensaje | Causa |
|---------|-------|
| *Usuario no encontrado!* | El carnet no existe. |
| *El usuario esta inactivo!* | El usuario está inactivo (por ejemplo, ya no está matriculado). |
| *El equipo ya esta en uso* | Otro usuario tomó el equipo o está en mantenimiento. |
| *El usuario ya tiene un prestamo activo* | El estudiante ya tiene una computadora prestada; primero debe devolverla. |

> 📷 **CAPTURA 09 — Error al prestar**
> - **Dónde:** misma pantalla.
> - **Qué mostrar:** intente prestar a un estudiante que ya tiene un equipo y capture la notificación *"El usuario ya tiene un prestamo activo"*.
> - **Guardar como:** `docs/img/09-lc-error-prestamo.png`

### 6.2 Finalizar un préstamo (devolución)

En la misma pantalla, la sección **Sesiones Activas** muestra una tarjeta por cada equipo prestado, con el número de equipo, su sistema operativo, el nombre del estudiante y la hora de inicio. El número junto al título indica cuántos préstamos hay activos.

1. Ubique la tarjeta del equipo devuelto.
2. Pulse **Finalizar sesión**.
3. Aparecerá *"Sesión cerrada correctamente"*; la tarjeta desaparece y el equipo vuelve a estar disponible.

> 📷 **CAPTURA 10 — Sesiones activas**
> - **Dónde:** `/learning-center/prestamos`, desplazándose hacia abajo.
> - **Qué mostrar:** al menos 2–3 tarjetas de préstamos activos con el botón rojo "Finalizar sesión" y el contador junto a "Sesiones Activas".
> - **Guardar como:** `docs/img/10-lc-sesiones-activas.png`

> Todos los días a las 6:58 a. m. el sistema envía un correo recordatorio a los usuarios que tengan préstamos activos de ese día.

### 6.3 Inventario de dispositivos

Menú **Learning center → Dispositivos** (`/learning-center/manage`).

Muestra todas las computadoras con: ID, sistema operativo, marca y modelo, número de inventario, sección y estado (*Disponible* / *Ocupado* / *Mantenimiento*). Puede filtrar por cualquiera de esas columnas.

> 📷 **CAPTURA 11 — Inventario de dispositivos**
> - **Dónde:** `/learning-center/manage`.
> - **Qué mostrar:** la tabla con varios equipos en distintos estados y el botón "Nuevo Equipo".
> - **Guardar como:** `docs/img/11-lc-inventario.png`

**Registrar un equipo** (*solo Administrador*)

1. Pulse **Nuevo Equipo**.
2. Complete: **Marca**, **Modelo**, **Inventario**, **Sección**, **S.O.** (Windows/Mac/Linux).
   - *Inventario*: solo MAYÚSCULAS, números y guiones (ej. `INV-0042`), máximo 30 caracteres.
   - *Marca*: 2 a 50 caracteres. *Sección*: 1 a 20 caracteres.
3. Pulse **Guardar**. El equipo se crea como *Disponible*.

**Editar un equipo** (*solo Administrador*)

1. En la columna **Acciones**, pulse el ícono de editar del equipo.
2. Modifique los datos o el **Estado** (por ejemplo, para enviarlo a mantenimiento).
3. Pulse **Actualizar**.

> ⚠️ No cambie manualmente un equipo *Ocupado* a *Disponible*: finalice su préstamo desde *Sesiones Activas* para que quede registrada la devolución.

> 📷 **CAPTURA 12 — Formulario de equipo**
> - **Dónde:** `/learning-center/manage` → "Nuevo Equipo" (o el botón de editar de un equipo).
> - **Qué mostrar:** el modal "Registrar Nuevo Equipo" con todos los campos completados.
> - **Guardar como:** `docs/img/12-lc-form-equipo.png`

### 6.4 Consultar el historial de préstamos de computadoras

Menú **Learning center → Consultas** (`/learning-center/tabla`) — *Préstamos de Dispositivos*.

La tabla muestra: carnet, nombre del usuario, fecha, quién entregó (cargo) y a qué hora, quién recibió (descargo) y a qué hora, y el número de equipo.

Filtros disponibles: *Fecha exacta*, *Fecha desde*, *Fecha hasta*, *Carnet de Usuario*, *¿Entregado?*, *Bibliotecario (Cargo)*, *Hora cargo desde/hasta*, *¿Devuelto?*, *Bibliotecario (Descargo)*, *Hora descargo desde/hasta*, *ID Dispositivo*.

Ejemplos de uso:

- **Préstamos sin devolver:** filtro *¿Devuelto?* = **No**.
- **Préstamos de un estudiante:** filtro *Carnet de Usuario*.
- **Préstamos de un mes:** *Fecha desde* = primer día, *Fecha hasta* = último día.

> 📷 **CAPTURA 13 — Historial de préstamos de computadoras**
> - **Dónde:** `/learning-center/tabla`.
> - **Qué mostrar:** la tabla con préstamos finalizados y activos (columna *Descargo* vacía en los activos).
> - **Guardar como:** `docs/img/13-lc-historial.png`

---

## 7. Lockers (casilleros)

*Rol requerido: Recepción o Administrador.*

### 7.1 Ver el estado de los casilleros

Menú **Lockers → Prestamos** (`/lockers/prestamos`) — *Control de Lockers*.

- En la parte superior se ven los contadores **Disponibles** (verde) y **Ocupados** (rojo).
- La cuadrícula muestra los 140 casilleros numerados:
  - **Verde**: libre.
  - **Rojo**: ocupado.
- Si la cuadrícula no cabe en pantalla, desplácese horizontalmente.

> 📷 **CAPTURA 14 — Cuadrícula de lockers**
> - **Dónde:** `/lockers/prestamos`.
> - **Qué mostrar:** la cuadrícula con varios casilleros ocupados (rojos) y libres (verdes) y los contadores superiores.
> - **Guardar como:** `docs/img/14-lockers-grid.png`

### 7.2 Prestar un casillero

1. Haga clic en un casillero **verde**.
2. En la ventana *Locker #N*, escriba o escanee el carnet en **ID de Usuario**.
3. Verifique el nombre y la foto que aparecen.
4. Pulse **Confirmar Préstamo**. Verá *"Locker #N asignado correctamente"* y el casillero se pondrá rojo.

> Al prestar un casillero también se registra automáticamente el **ingreso (check-in)** del usuario.

Mensajes posibles: *Usuario no encontrado!*, *El usuario esta inactivo!*, *El casillero ya esta en uso*, *El usuario ya tiene un prestamo activo* (ya tiene otro casillero).

> 📷 **CAPTURA 15 — Préstamo de locker**
> - **Dónde:** `/lockers/prestamos` → clic en un casillero verde.
> - **Qué mostrar:** el diálogo "Locker #N" con un carnet escrito, la tarjeta con nombre/foto del usuario y el botón "Confirmar Préstamo".
> - **Guardar como:** `docs/img/15-lockers-prestar.png`

### 7.3 Liberar un casillero

1. Haga clic en un casillero **rojo**.
2. En la ventana *Finalizar Préstamo*, confirme con **Sí, Liberar Locker**.
3. Verá *"Casillero liberado correctamente"* y el casillero volverá a verde.

> 📷 **CAPTURA 16 — Liberar locker**
> - **Dónde:** `/lockers/prestamos` → clic en un casillero rojo.
> - **Qué mostrar:** el diálogo de confirmación con los botones "Cancelar" y "Sí, Liberar Locker".
> - **Guardar como:** `docs/img/16-lockers-liberar.png`

### 7.4 Historial de préstamos de lockers

Menú **Lockers → Consultas** (`/lockers/tabla`) — *Préstamos de Lockers*. Funciona igual que el historial de computadoras (sección 6.4); en lugar de *ID Dispositivo* tiene el filtro **ID Locker**.

> 📷 **CAPTURA 17 — Historial de lockers**
> - **Dónde:** `/lockers/tabla`.
> - **Qué mostrar:** la tabla con préstamos, idealmente con el filtro *ID Locker* aplicado.
> - **Guardar como:** `docs/img/17-lockers-historial.png`

---

## 8. Check-in (registro de ingresos)

*Rol requerido: Recepción o Administrador.*

### 8.1 Registrar un ingreso

Menú **Checkin → Checkin** (`/checkin/create`) — *Registro de Ingreso*.

Esta pantalla está pensada para usarse como **kiosco** (por ejemplo, una tablet en la entrada con un lector de carnés):

1. El cursor se coloca solo en el campo *Esperando lectura de carnet…* (aunque se haga clic en otra parte).
2. Escanee el carnet (o escríbalo y presione **Enter**).
3. Si el usuario es válido aparece su foto, su nombre y **INGRESO EXITOSO** durante 2 segundos; luego la pantalla queda lista para el siguiente.
4. Si hay un problema aparece una notificación roja (*Usuario no encontrado!*, *El usuario esta inactivo!*).

> 📷 **CAPTURA 18 — Check-in en espera**
> - **Dónde:** `/checkin/create`.
> - **Qué mostrar:** la pantalla vacía con el texto "El cursor está listo para recibir el código".
> - **Guardar como:** `docs/img/18-checkin-espera.png`

> 📷 **CAPTURA 19 — Check-in exitoso**
> - **Dónde:** misma pantalla, inmediatamente después de escanear un carnet válido (tiene 2 segundos).
> - **Qué mostrar:** foto, nombre y "INGRESO EXITOSO".
> - **Guardar como:** `docs/img/19-checkin-exitoso.png`

### 8.2 Consultar ingresos

Menú **Checkin → Consultas** (`/checkin/tabla`) — *Registro de Ingresos*. Muestra carnet, nombre, fecha y hora de cada ingreso, del más reciente al más antiguo. Filtros: *Fecha Exacta*, *Fecha Desde*, *Fecha Hasta*, *Hora Desde*, *Hora Hasta* (formato `HH:MM`, ej. `08:30`), *ID de Usuario*.

> 📷 **CAPTURA 20 — Historial de ingresos**
> - **Dónde:** `/checkin/tabla`.
> - **Qué mostrar:** la tabla con varios ingresos y un filtro de fecha aplicado.
> - **Guardar como:** `docs/img/20-checkin-historial.png`

---

## 9. Usuarios

*Rol requerido: Bibliotecario o Administrador.*

Menú **Usuarios → Usuarios** (`/user/manejo`) — *Gestión de Usuarios*.

La tabla muestra: carnet, nombre completo, correo, facultad, tipo, **roles** (solo para administradores), estado (*Activo/Inactivo*) y fecha de vencimiento. Filtros: *Carnet*, *Nombre*, *Apellido*, *Correo*, *Tipo de usuario*, *Facultad*, *Estado*.

> 📷 **CAPTURA 21 — Gestión de usuarios**
> - **Dónde:** `/user/manejo` con sesión de **administrador**.
> - **Qué mostrar:** la tabla con la columna *Roles* visible y los botones "Sincronizar Usuarios" y "Nuevo Usuario".
> - **Guardar como:** `docs/img/21-usuarios-tabla.png`

### 9.1 Origen de los usuarios

- **Estudiantes, empleados y estudiantes PEC** se cargan automáticamente desde la base institucional de la UCA todas las noches (00:00). Los que ya no aparecen en la base institucional quedan **Inactivos** y no pueden recibir préstamos.
- **Visitantes** (lectores ocasionales, investigadores, cortesías, hijos de empleados) se registran manualmente con **Nuevo Usuario**.

### 9.2 Crear un usuario (visitantes)

1. Pulse **Nuevo Usuario**.
2. Complete:
   - **Prefijo**: tipo de usuario — `4` Lector Privado, `5` Lector Público, `6` Investigador (6 meses), `8` Investigador (1 mes), `9` Cortesía, `17` Hijo de empleado.
   - **Número de Carnet**: el número asignado. El carnet final será `prefijo-número` (ej. `4-000124`).
   - **Email**, **Nombres**, **Apellidos**, **Género**.
   - **Fecha Expiración**: hasta cuándo es válido.
3. Pulse **Guardar Usuario**. Verá *"Usuario creado correctamente"*.

Errores posibles: *Ya existe un usuario con ese id*, *Ya existe un usuario con ese correo*.

> 📷 **CAPTURA 22 — Formulario de nuevo usuario**
> - **Dónde:** `/user/manejo` → "Nuevo Usuario".
> - **Qué mostrar:** el formulario "Crear Nuevo Usuario" completado, con el selector de prefijo visible.
> - **Guardar como:** `docs/img/22-usuarios-nuevo.png`

### 9.3 Asignar o quitar roles (*solo Administrador*)

En la columna **Roles**:

- **Agregar**: pulse el ícono **⊕** y marque el rol deseado (`learningcenter`, `reception`, `librarian`, `admin`).
- **Quitar**: pulse la **x** del chip del rol, o desmárquelo en el menú del ícono ⊕.
- El rol `user` no puede quitarse.

Los cambios aplican inmediatamente: la próxima vez que esa persona recargue la página verá los nuevos menús.

> 📷 **CAPTURA 23 — Gestión de roles**
> - **Dónde:** `/user/manejo`, como administrador.
> - **Qué mostrar:** el menú del ícono ⊕ abierto en la fila de un usuario, con las casillas de roles.
> - **Guardar como:** `docs/img/23-usuarios-roles.png`

### 9.4 Sincronizar usuarios (*solo Administrador*)

El botón **Sincronizar Usuarios** ejecuta en ese momento la carga desde la base institucional (normalmente ocurre cada noche). Úselo cuando un estudiante recién matriculado todavía no aparece. Puede tardar varios minutos.

> 📷 **CAPTURA 24 — Sincronización en curso**
> - **Dónde:** `/user/manejo` → "Sincronizar Usuarios".
> - **Qué mostrar:** el botón en estado "Sincronizando…" y la notificación correspondiente.
> - **Guardar como:** `docs/img/24-usuarios-sincronizar.png`

---

## 10. Cuentas WiFi

*Rol requerido: Bibliotecario o Administrador.*

Menú **Usuarios → Usuarios Wifi** (`/user/wifi`) — *Cuentas WiFi*.

La tabla muestra cada cuenta WiFi con: ID, **Cupos** (usuarios asignados de un máximo de 3), contraseña, fecha de creación y fecha de expiración. La flecha al inicio de cada fila despliega el detalle de asignaciones (usuario, bibliotecario que entregó, fecha y hora).

> 📷 **CAPTURA 25 — Cuentas WiFi**
> - **Dónde:** `/user/wifi`.
> - **Qué mostrar:** la tabla con cuentas en distintos cupos (0/3, 1/3, 3/3) y una fila desplegada mostrando el detalle de asignaciones. **Difumine las contraseñas.**
> - **Guardar como:** `docs/img/25-wifi-tabla.png`

### 10.1 Cargar cuentas desde un CSV

1. Prepare un archivo `.csv` (puede crearlo en Excel con *Guardar como → CSV*) con este formato exacto:

   ```csv
   id,password
   wifi0001,Abc123
   wifi0002,Xyz789
   ```

   - La primera fila debe ser el encabezado `id,password`.
   - El `id` puede tener máximo 8 caracteres.
2. Pulse **Subir Usuarios CSV** y elija el archivo.
3. Aparecerá un mensaje como *"2 usuarios insertados, 1 omitidos"*. Se omiten las cuentas que ya existían y las filas inválidas.

Todas las cuentas cargadas vencen el **31 de diciembre** del año en curso.

> 📷 **CAPTURA 26 — Resultado de carga CSV**
> - **Dónde:** `/user/wifi` → "Subir Usuarios CSV".
> - **Qué mostrar:** la notificación verde con el resumen de usuarios insertados/omitidos.
> - **Guardar como:** `docs/img/26-wifi-csv.png`

> 📷 **CAPTURA 27 — Ejemplo de archivo CSV**
> - **Dónde:** el archivo CSV abierto en Excel o en el Bloc de notas.
> - **Qué mostrar:** el encabezado `id,password` y algunas filas de ejemplo (datos ficticios).
> - **Guardar como:** `docs/img/27-wifi-csv-ejemplo.png`

### 10.2 Asignar una cuenta WiFi a un usuario

1. En la fila de la cuenta, pulse el ícono **Asignar** (persona con +). Está deshabilitado si la cuenta ya tiene 3 usuarios.
2. Escriba o escanee el carnet en **Carnet de Usuario** y verifique el nombre y la foto.
3. Pulse **Confirmar Asignación**.

Reglas: una cuenta se comparte con máximo **3** usuarios y cada usuario puede tener solo **una** cuenta vigente. Si no se cumple, el diálogo muestra el error en rojo (*Demasiados usuarios asignados a este usuario wifi!* / *Este usuario ya tiene un usuario wifi asignado!*).

> 📷 **CAPTURA 28 — Asignar cuenta WiFi**
> - **Dónde:** `/user/wifi` → ícono "Asignar" de una cuenta.
> - **Qué mostrar:** el diálogo "Cuenta WiFi" con un carnet escrito y la tarjeta del usuario encontrado.
> - **Guardar como:** `docs/img/28-wifi-asignar.png`

---

## 11. Mensajes frecuentes y cómo resolverlos

| Mensaje | Dónde aparece | Solución |
|---------|---------------|----------|
| *Usuario no encontrado!* | Préstamos, check-in, WiFi | Verifique el carnet. Si es un estudiante nuevo, pida al administrador sincronizar usuarios; si es visitante, regístrelo (9.2). |
| *El usuario esta inactivo!* | Préstamos, check-in | El usuario ya no está vigente en la base institucional o venció. Consulte con el administrador. |
| *El usuario ya tiene un prestamo activo* | Préstamos | Finalice primero el préstamo anterior. |
| *El equipo ya esta en uso* / *El casillero ya esta en uso* | Préstamos | Elija otro equipo/casillero o refresque la pantalla. |
| *Usuario no autorizado* | Cualquier pantalla | Su rol no permite esa acción. Pida el rol al administrador. |
| La pantalla lo regresa al inicio de sesión | Cualquier pantalla | Su sesión venció. Vuelva a iniciar sesión. |
| *Solo se permiten archivos CSV* | Carga WiFi | Guarde el archivo con extensión `.csv`. |
| *Error del servidor* | Cualquier pantalla | Error interno. Reintente; si persiste, avise al área de TI indicando la hora y la acción realizada. |

---

## 12. Preguntas frecuentes

**¿Por qué no veo algunos menús?**
Los menús dependen de sus roles. Un administrador puede asignarle el rol necesario (9.3).

**¿Por qué no aparece la foto o el nombre del estudiante al escribir el carnet?**
La búsqueda se activa cuando el carnet tiene al menos 8 caracteres. Si aun así no aparece, el carnet no está registrado.

**Un estudiante devolvió el equipo pero sigue en "Sesiones Activas".**
Pulse *Finalizar sesión* en su tarjeta. No cambie el estado del equipo desde el inventario.

**¿Se puede deshacer una devolución o liberación?**
No. Si se finalizó por error, registre un nuevo préstamo.

**¿A qué hora se guardan los préstamos e ingresos?**
En la hora local de El Salvador.

---

## Anexo A: Lista de capturas

| # | Archivo | Pantalla / ruta | Rol para tomarla | Preparación |
|---|---------|-----------------|------------------|-------------|
| 01 | `01-login.png` | `/login` | Sin sesión | — |
| 02 | `02-login-microsoft.png` | Página de Microsoft | Sin sesión | Pulsar "Iniciar sesión con Microsoft" |
| 03 | `03-login-error.png` | `/login` | Sin sesión | Correo no registrado |
| 04 | `04-navbar.png` | Cualquiera | Admin | Menú "Learning center" desplegado |
| 05 | `05-filtros-menu.png` | `/learning-center/tabla` | Admin / LC | Menú "+ Filtros" abierto |
| 06 | `06-filtros-aplicados.png` | `/learning-center/tabla` | Admin / LC | 2 filtros aplicados |
| 07 | `07-lc-nuevo-prestamo.png` | `/learning-center/prestamos` | Admin / LC | Carnet + equipo seleccionados |
| 08 | `08-lc-seleccion-equipo.png` | `/learning-center/prestamos` | Admin / LC | Selector de equipos abierto |
| 09 | `09-lc-error-prestamo.png` | `/learning-center/prestamos` | Admin / LC | Estudiante con préstamo activo |
| 10 | `10-lc-sesiones-activas.png` | `/learning-center/prestamos` | Admin / LC | 2–3 préstamos activos |
| 11 | `11-lc-inventario.png` | `/learning-center/manage` | Admin | Equipos en varios estados |
| 12 | `12-lc-form-equipo.png` | `/learning-center/manage` | Admin | Modal "Nuevo Equipo" lleno |
| 13 | `13-lc-historial.png` | `/learning-center/tabla` | Admin / LC | Préstamos activos y finalizados |
| 14 | `14-lockers-grid.png` | `/lockers/prestamos` | Admin / Recepción | Algunos lockers ocupados |
| 15 | `15-lockers-prestar.png` | `/lockers/prestamos` | Admin / Recepción | Clic en locker verde + carnet |
| 16 | `16-lockers-liberar.png` | `/lockers/prestamos` | Admin / Recepción | Clic en locker rojo |
| 17 | `17-lockers-historial.png` | `/lockers/tabla` | Admin / Recepción | Filtro *ID Locker* |
| 18 | `18-checkin-espera.png` | `/checkin/create` | Admin / Recepción | — |
| 19 | `19-checkin-exitoso.png` | `/checkin/create` | Admin / Recepción | Escanear carnet válido |
| 20 | `20-checkin-historial.png` | `/checkin/tabla` | Admin / Recepción | Filtro de fecha |
| 21 | `21-usuarios-tabla.png` | `/user/manejo` | Admin | — |
| 22 | `22-usuarios-nuevo.png` | `/user/manejo` | Admin / Bibliotecario | Formulario lleno |
| 23 | `23-usuarios-roles.png` | `/user/manejo` | Admin | Menú ⊕ abierto |
| 24 | `24-usuarios-sincronizar.png` | `/user/manejo` | Admin | Pulsar "Sincronizar Usuarios" |
| 25 | `25-wifi-tabla.png` | `/user/wifi` | Admin / Bibliotecario | Una fila desplegada; contraseñas difuminadas |
| 26 | `26-wifi-csv.png` | `/user/wifi` | Admin / Bibliotecario | Subir un CSV |
| 27 | `27-wifi-csv-ejemplo.png` | Excel / Bloc de notas | — | CSV de ejemplo |
| 28 | `28-wifi-asignar.png` | `/user/wifi` | Admin / Bibliotecario | Diálogo de asignación con usuario |

**Datos de prueba sugeridos antes de tomar las capturas:** 3–4 computadoras (una en mantenimiento), 2–3 préstamos de computadora activos y algunos finalizados, 5–10 casilleros ocupados, varios check-in de distintos días, un visitante creado manualmente y un CSV con 3–4 cuentas WiFi (una asignada a 3 usuarios).
