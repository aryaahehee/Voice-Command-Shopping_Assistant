import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendValidationError } from "../utils/apiResponse";

/**
 * Reads express-validator results and short-circuits the request
 * with a 422 if any validation rules failed.
 *
 * Place this AFTER your validation chains:
 *   router.post("/", [body("email").isEmail()], validate, controller)
 */
export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendValidationError(res, errors.array());
    return;
  }
  next();
}
