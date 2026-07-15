import { body } from "express-validator";
import { ResourceStates } from "../utils/states.constant";

export const createDeviceValidator = [
  body('brand')
    .exists().withMessage('brand is required')
    .isString().withMessage('brand must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('brand length must be between 2 and 50'),

  body('section')
    .exists().withMessage('section is required')
    .isString().withMessage('section must be a string')
    .isLength({ min: 1, max: 20 }).withMessage('section length must be between 1 and 20'),

  body('model')
    .exists().withMessage('model is required')
    .isString().withMessage('model must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('model length must be between 1 and 100'),

  body('inventory')
    .exists().withMessage('inventory is required')
    .isString().withMessage('inventory must be a string')
    .matches(/^[A-Z0-9\-]+$/).withMessage('inventory must only contain uppercase letters, numbers and dashes')
    .isLength({ max: 30 }).withMessage('inventory max length is 30'),
];

export const updateDeviceValidator = [
  body("state")
    .optional()
    .isString()
    .custom((value) => {
      if (!Object.values(ResourceStates).includes(value as ResourceStates)) {
        throw new Error(`Estado inválido: ${value}`);
      }
      return true;
    }),
  body('brand')
    .optional()
    .isString().withMessage('brand must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('brand length must be between 2 and 50'),

  body('section')
    .optional()
    .isString().withMessage('section must be a string')
    .isLength({ min: 1, max: 20 }).withMessage('section length must be between 1 and 20'),

  body('model')
    .optional()
    .isString().withMessage('model must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('model length must be between 1 and 100'),

  body('inventary')
    .optional()
    .isString().withMessage('inventary must be a string')
    .matches(/^[A-Z0-9\-]+$/).withMessage('inventary must only contain uppercase letters, numbers and dashes')
    .isLength({ max: 30 }).withMessage('inventary max length is 30'),
];
