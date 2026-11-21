/**
 * Construye la URL publica de la foto de un usuario.
 * - Si la foto ya es una URL absoluta (p. ej. viene de la API institucional) se devuelve tal cual.
 * - Si es una ruta local (/uploads/...) se le antepone API_URL.
 * - Si no hay foto se devuelve null.
 */
export const getPhotoUrl = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null;
  if (/^https?:\/\//i.test(photoPath)) return photoPath;

  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  return `${baseUrl}${photoPath}`;
};
