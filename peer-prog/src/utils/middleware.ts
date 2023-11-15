import {
  type Response,
  type Request,
  type NextFunction,
  type RequestHandler,
} from 'express'
import { StatusCodes } from 'http-status-codes'
import MethodNotAllowed from './errors/MethodNotAllowed'

type JsonHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

function safeStringify(obj: unknown): string {
  const cache = new Set();
  const stringified = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Explicitly return undefined
        return undefined; 
      }
      cache.add(value);
    }
    return value;
  });
  cache.clear();
  return stringified;
}


/**
 * Wraps a request handler that returns an object and
 * sends it as JSON. Handles async errors.
 * @param handler Request handler that returns a serializable object.
 * @returns Request handler that sends the result as JSON.
 */
export function jsonRoute<T>(
  handler: JsonHandler<T>,
  statusCode = StatusCodes.OK
): RequestHandler {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      if (!res.headersSent) { // Check if the headers have been sent
        res.status(statusCode).json(result);
        res.send(safeStringify(result));
      }
    } catch (error) {
      if (!res.headersSent) { // check if the headers have been sent
        next(error);
      } else {
        // eslint-disable-next-line no-console
        console.error('Error after response sent:', error);

      }
    }
  };
}
export function unsupportedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new MethodNotAllowed())
}
