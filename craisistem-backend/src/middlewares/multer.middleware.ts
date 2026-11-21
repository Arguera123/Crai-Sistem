import createHttpError from "http-errors";
import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  // El CSV se borra despues de leerse, por lo que basta con el directorio temporal
  destination: os.tmpdir(),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.parse(file.originalname).name;
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

export const uploadCSV = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(createHttpError(400, 'Solo se permiten archivos CSV'));
    }
  },
});