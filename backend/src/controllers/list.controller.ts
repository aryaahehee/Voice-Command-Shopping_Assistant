import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../types";
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from "../utils/apiResponse";
import { ListService } from "../services/list.service";

const listService = new ListService();

/** GET /api/lists — get all lists for the authenticated user */
export const getLists = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const lists = await listService.getListsByUser(req.user!._id.toString());
    sendSuccess(res, lists, "Lists fetched");
  }
);

/** POST /api/lists — create a new shopping list */
export const createList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.createList(
      req.user!._id.toString(),
      req.body.name as string
    );
    sendCreated(res, list, "List created");
  }
);

/** GET /api/lists/:id — get a single list */
export const getList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.getListById(
      req.params.id as string,
      req.user!._id.toString()
    );
    if (!list) { sendNotFound(res, "List not found"); return; }
    sendSuccess(res, list, "List fetched");
  }
);

/** PATCH /api/lists/:id — update a list's name or active status */
export const updateList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.updateList(
      req.params.id as string,
      req.user!._id.toString(),
      req.body as { name?: string; isActive?: boolean }
    );
    if (!list) { sendNotFound(res, "List not found"); return; }
    sendSuccess(res, list, "List updated");
  }
);

/** DELETE /api/lists/:id — delete a list */
export const deleteList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const deleted = await listService.deleteList(
      req.params.id as string,
      req.user!._id.toString()
    );
    if (!deleted) { sendNotFound(res, "List not found"); return; }
    sendSuccess(res, null, "List deleted");
  }
);

/** POST /api/lists/:id/items — add an item to a list */
export const addItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.addItem(
      req.params.id as string,
      req.user!._id.toString(),
      req.body
    );
    if (!list) { sendNotFound(res, "List not found"); return; }
    sendCreated(res, list, "Item added");
  }
);

/** PATCH /api/lists/:id/items/:itemId — update an item */
export const updateItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.updateItem(
      req.params.id as string,
      req.params.itemId as string,
      req.user!._id.toString(),
      req.body
    );
    if (!list) { sendNotFound(res, "List or item not found"); return; }
    sendSuccess(res, list, "Item updated");
  }
);

/** DELETE /api/lists/:id/items/:itemId — remove an item */
export const deleteItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.removeItem(
      req.params.id as string,
      req.params.itemId as string,
      req.user!._id.toString()
    );
    if (!list) { sendNotFound(res, "List or item not found"); return; }
    sendSuccess(res, list, "Item removed");
  }
);

/** PATCH /api/lists/:id/items/:itemId/toggle — toggle checked state */
export const toggleItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const list = await listService.toggleItem(
      req.params.id as string,
      req.params.itemId as string,
      req.user!._id.toString()
    );
    if (!list) { sendNotFound(res, "List or item not found"); return; }
    sendSuccess(res, list, "Item toggled");
  }
);
