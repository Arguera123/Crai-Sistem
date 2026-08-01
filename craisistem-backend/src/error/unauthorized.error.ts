import { HttpException } from "./http.exception";

export class UnauthorizedError extends HttpException {
  readonly statusCode = 401;
}