/**
 * ListService — CRUD operations for shopping lists and items.
 * Full Mongoose implementation wired in Milestone 4.
 */
export class ListService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getListsByUser(_userId: string) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createList(_userId: string, _name: string) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getListById(_id: string, _userId: string) {
    return null;
  }

  async updateList(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _updates: { name?: string; isActive?: boolean }
  ) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteList(_id: string, _userId: string): Promise<boolean> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addItem(_listId: string, _userId: string, _itemData: unknown) {
    return null;
  }

  async updateItem(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _listId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _itemId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _updates: unknown
  ) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeItem(_listId: string, _itemId: string, _userId: string) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async toggleItem(_listId: string, _itemId: string, _userId: string) {
    return null;
  }
}
