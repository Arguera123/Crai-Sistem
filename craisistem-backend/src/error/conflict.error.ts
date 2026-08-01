import { HttpException } from "./http.exception";

export class ConflictError extends HttpException {
  readonly statusCode = 409;
}