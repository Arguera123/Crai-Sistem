import { HttpException } from "./http.exception";

export class InternalServerError extends HttpException {
  readonly statusCode = 500;
}