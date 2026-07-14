import { Response } from "express";

/**
 * Standardised API response helpers.
 * Every controller should use these instead of calling res.json() directly.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/** 200 OK with data */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/** 200 OK with data + pagination metadata */
export function sendPaginated<T>(
  res: Response,
  data: T,
  pagination: PaginationMeta,
  message = "Success"
): void {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

/** 201 Created */
export function sendCreated<T>(res: Response, data: T, message = "Created"): void {
  sendSuccess(res, data, message, 201);
}

/** 400 Bad Request */
export function sendBadRequest(res: Response, message = "Bad request"): void {
  res.status(400).json({ success: false, error: message });
}

/** 401 Unauthorized */
export function sendUnauthorized(
  res: Response,
  message = "Unauthorized"
): void {
  res.status(401).json({ success: false, error: message });
}

/** 403 Forbidden */
export function sendForbidden(res: Response, message = "Forbidden"): void {
  res.status(403).json({ success: false, error: message });
}

/** 404 Not Found */
export function sendNotFound(res: Response, message = "Not found"): void {
  res.status(404).json({ success: false, error: message });
}

/** 409 Conflict */
export function sendConflict(res: Response, message = "Conflict"): void {
  res.status(409).json({ success: false, error: message });
}

/** 422 Unprocessable Entity (validation) */
export function sendValidationError(
  res: Response,
  errors: object[]
): void {
  res.status(422).json({
    success: false,
    error: "Validation failed",
    details: errors,
  });
}

/** 500 Internal Server Error */
export function sendServerError(
  res: Response,
  message = "Internal server error"
): void {
  res.status(500).json({ success: false, error: message });
}
