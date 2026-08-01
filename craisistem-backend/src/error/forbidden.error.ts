import { HttpException } from "./http.exception";

export class ForbiddenError extends HttpException {
  readonly statusCode = 403;
}