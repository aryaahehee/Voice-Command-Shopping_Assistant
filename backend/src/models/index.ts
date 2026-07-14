/**
 * Central model export — import from here everywhere.
 * Also ensures all schemas are registered with Mongoose
 * when this module is first imported.
 */
export { User } from "./User";
export type { IUser, IUserModel, IUserPreferences } from "./User";

export { ShoppingList, detectCategory } from "./ShoppingList";
export type { IShoppingList, IShoppingItem, IShoppingListModel } from "./ShoppingList";

export { PurchaseHistory } from "./PurchaseHistory";
export type { IPurchaseHistory, IPurchaseHistoryModel } from "./PurchaseHistory";

export { RefreshToken } from "./RefreshToken";
export type { IRefreshToken } from "./RefreshToken";
