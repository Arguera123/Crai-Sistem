import multer from "multer";
import path from "path";
import { ErrorCodes } from "../error/errorCodes";
import { BadRequestError } from "../error/bad-request.error";

const storage = multer.diskStorage({
  destination: 'src/uploads/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.parse(file.originalname).name;
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

export const uploadCSV = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(new BadRequestError(ErrorCodes.FILE.INVALID_FORMAT));
    }
  },
});