import { Router } from "express";
import { body, param } from "express-validator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import {
  getLists,
  createList,
  getList,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
  toggleItem,
} from "../controllers/list.controller";

const router = Router();

// All list routes require authentication
router.use(authenticate);

// ── Shopping Lists ─────────────────────────────────────────
// GET  /api/lists
router.get("/", getLists);

// POST /api/lists
router.post(
  "/",
  [body("name").trim().notEmpty().withMessage("List name is required").isLength({ max: 100 })],
  validate,
  createList
);

// GET  /api/lists/:id
router.get("/:id", [param("id").isMongoId().withMessage("Invalid list ID")], validate, getList);

// PATCH /api/lists/:id
router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid list ID"),
    body("name").optional().trim().notEmpty().isLength({ max: 100 }),
  ],
  validate,
  updateList
);

// DELETE /api/lists/:id
router.delete("/:id", [param("id").isMongoId()], validate, deleteList);

// ── Items within a list ────────────────────────────────────
// POST /api/lists/:id/items
router.post(
  "/:id/items",
  [
    param("id").isMongoId().withMessage("Invalid list ID"),
    body("name").trim().notEmpty().withMessage("Item name is required").isLength({ max: 100 }),
    body("quantity").optional().isFloat({ min: 0.1 }),
    body("unit").optional().isString(),
    body("category").optional().isString(),
    body("price").optional().isFloat({ min: 0 }),
    body("notes").optional().isString().isLength({ max: 300 }),
  ],
  validate,
  addItem
);

// PATCH /api/lists/:id/items/:itemId
router.patch(
  "/:id/items/:itemId",
  [
    param("id").isMongoId(),
    param("itemId").isMongoId(),
  ],
  validate,
  updateItem
);

// DELETE /api/lists/:id/items/:itemId
router.delete(
  "/:id/items/:itemId",
  [param("id").isMongoId(), param("itemId").isMongoId()],
  validate,
  deleteItem
);

// PATCH /api/lists/:id/items/:itemId/toggle
router.patch(
  "/:id/items/:itemId/toggle",
  [param("id").isMongoId(), param("itemId").isMongoId()],
  validate,
  toggleItem
);

export default router;
