import { body, query } from "express-validator";
import { ResourceStates } from "../utils/states.constant";
import { OSEnum } from "../models/device.entity";

const INVENTORY_REGEX = /^[A-Z0-9\-]+$/;

export const createDeviceValidator = [
  body('brand')
    .exists().withMessage('brand es requerido')
    .isString().withMessage('brand debe ser texto')
    .isLength({ min: 2, max: 50 }).withMessage('brand debe tener entre 2 y 50 caracteres'),

  body('section')
    .exists().withMessage('section es requerido')
    .isString().withMessage('section debe ser texto')
    .isLength({ min: 1, max: 20 }).withMessage('section debe tener entre 1 y 20 caracteres'),

  body('model')
    .exists().withMessage('model es requerido')
    .isString().withMessage('model debe ser texto')
    .isLength({ min: 1, max: 100 }).withMessage('model debe tener entre 1 y 100 caracteres'),

  body('inventory')
    .exists().withMessage('inventory es requerido')
    .isString().withMessage('inventory debe ser texto')
    .matches(INVENTORY_REGEX).withMessage('inventory solo admite letras mayusculas, numeros y guiones')
    .isLength({ max: 30 }).withMessage('inventory admite maximo 30 caracteres'),

  body('operatingSystem')
    .exists().withMessage('operatingSystem es requerido')
    .isIn(Object.values(OSEnum)).withMessage(`operatingSystem debe ser uno de: ${Object.values(OSEnum).join(', ')}`),
];

export const updateDeviceValidator = [
  body("state")
    .optional()
    .isIn(Object.values(ResourceStates)).withMessage(`state debe ser uno de: ${Object.values(ResourceStates).join(', ')}`),

  body('brand')
    .optional()
    .isString().withMessage('brand debe ser texto')
    .isLength({ min: 2, max: 50 }).withMessage('brand debe tener entre 2 y 50 caracteres'),

  body('section')
    .optional()
    .isString().withMessage('section debe ser texto')
    .isLength({ min: 1, max: 20 }).withMessage('section debe tener entre 1 y 20 caracteres'),

  body('model')
    .optional()
    .isString().withMessage('model debe ser texto')
    .isLength({ min: 1, max: 100 }).withMessage('model debe tener entre 1 y 100 caracteres'),

  body('inventory')
    .optional()
    .isString().withMessage('inventory debe ser texto')
    .matches(INVENTORY_REGEX).withMessage('inventory solo admite letras mayusculas, numeros y guiones')
    .isLength({ max: 30 }).withMessage('inventory admite maximo 30 caracteres'),

  body('operatingSystem')
    .optional()
    .isIn(Object.values(OSEnum)).withMessage(`operatingSystem debe ser uno de: ${Object.values(OSEnum).join(', ')}`),
];

const allowedDeviceOrderFields = ["id", "brand", "state", "section", "model", "inventory", "operatingSystem"];

export const deviceFiltersValidator = [
  query("id").optional().isInt({ min: 1 }).withMessage("id debe ser un numero entero"),
  query("state").optional().isIn(Object.values(ResourceStates)).withMessage("Estado invalido"),
  query("operatingSystem").optional().isIn(Object.values(OSEnum)).withMessage("Sistema operativo invalido"),
  query("order")
    .optional()
    .custom((value) => {
      const key = String(value).startsWith("-") ? String(value).slice(1) : String(value);
      if (!allowedDeviceOrderFields.includes(key)) throw new Error(`Campo de orden invalido: ${key}`);
      return true;
    }),
];
