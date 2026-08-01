import { HttpException } from "./http.exception";

export class NotFoundError extends HttpException {
  readonly statusCode = 404;
}