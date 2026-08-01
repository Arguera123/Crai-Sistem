import { HttpException } from "./http.exception";

export class BadRequestError extends HttpException {
  readonly statusCode = 400;
}