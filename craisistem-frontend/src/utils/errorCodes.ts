export const ErrorCodes = {
  SYSTEM: {
    VALIDATION_ERROR: {
      message: "Algunos campos del formulario no son válidos.",
      code: "VALIDATION_ERROR",
    },
    INTERNAL_ERROR: {
      message: "Ocurrió un error inesperado en el servidor.",
      code: "INTERNAL_SERVER_ERROR",
    },
  },
  AUTH: {
    UNAUTHENTICATED: {
      message: "Usuario no autenticado",
      code: "UNAUTHENTICATED",
    },
    UNAUTHORIZED: { message: "Usuario no autorizado", code: "UNAUTHORIZED" },
    INVALID_CREDENTIALS: {
      message: "El correo electrónico o la contraseña son incorrectos.",
      code: "INVALID_CREDENTIALS",
    },
    UNAUTHORIZED_ROLE: {
      message: "No posees los roles necesarios para acceder a la plataforma.",
      code: "UNAUTHORIZED_ROLE",
    },
    TOKEN_GENERATION_FAILED: {
      message: "No se pudo generar el token de acceso, intenta de nuevo.",
      code: "TOKEN_GENERATION_FAILED",
    },
  },
  USER: {
    NOT_FOUND: { message: "¡Usuario no encontrado!", code: "USER_NOT_FOUND" },
    ALREADY_EXISTS: {
      message: "¡El usuario ya se encuentra registrado en el sistema!",
      code: "USER_ALREADY_EXISTS",
    },
    INACTIVE: { message: "¡El usuario no está activo!", code: "USER_INACTIVE" },
    ROLE_NOT_FOUND: { message: "Rol no encontrado", code: "ROLE_NOT_FOUND" },
    ROLE_BASE_DELETION: {
      message: "No se puede eliminar el rol base del usuario",
      code: "ROLE_BASE_DELETION_NOT_ALLOWED",
    },
    ROLE_NOT_OWNED: {
      message: "El usuario no posee este rol",
      code: "ROLE_NOT_OWNED",
    },
  },
  DEVICE: {
    NOT_FOUND: { message: "¡Equipo no encontrado!", code: "DEVICE_NOT_FOUND" },
    IN_USE: { message: "El equipo ya está en uso", code: "DEVICE_IN_USE" },
  },
  LOCKER: {
    NOT_FOUND: {
      message: "¡Casillero no encontrado!",
      code: "LOCKER_NOT_FOUND",
    },
    IN_USE: { message: "El casillero ya está en uso", code: "LOCKER_IN_USE" },
  },
  LOAN: {
    NOT_FOUND: { message: "¡Préstamo no encontrado!", code: "LOAN_NOT_FOUND" },
    ALREADY_RELEASED: {
      message: "Este préstamo ya se ha completado y liberado previamente.",
      code: "LOAN_ALREADY_RELEASED",
    },
    ACTIVE_EXISTS: {
      message: "El usuario ya tiene un préstamo activo",
      code: "LOAN_ACTIVE_EXISTS",
    },
  },
  WIFI_USER: {
    NOT_FOUND: {
      message: "¡Usuario wifi no encontrado!",
      code: "WIFI_USER_NOT_FOUND",
    },
    LIMIT_REACHED: {
      message: "¡Demasiados usuarios asignados a este usuario wifi!",
      code: "WIFI_USER_LIMIT_REACHED",
    },
    ALREADY_ASSIGNED: {
      message: "¡Este usuario ya tiene un usuario wifi asignado!",
      code: "WIFI_USER_ALREADY_ASSIGNED",
    },
    ASSIGNMENT_NOT_FOUND: {
      message: "Asignación wifi no encontrada",
      code: "WIFI_ASSIGNMENT_NOT_FOUND",
    },
  },
  FILE: {
    MISSING: { message: "¡No se subió el archivo!", code: "FILE_MISSING" },
    INVALID_FORMAT: {
      message: "Solo se permiten archivos CSV",
      code: "FILE_INVALID_FORMAT",
    },
  },
} as const;
