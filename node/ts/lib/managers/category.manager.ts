import knex from "../../utils/knex";
import { v4 as uuidv4 } from "uuid";

class CategoryManager {
  constructor() {}
  public async getAll() {
    const categories: Array<DA.DB.Category> = await knex("categories").select();
    return categories;
  }

  public async getShown() {
    const categories: Array<DA.DB.Category> = await knex("categories")
      .where({ show: true })
      .select();
    return categories;
  }

  public async getHidden() {
    const categories: Array<DA.DB.Category> = await knex("categories")
      .where({ show: false })
      .select();
    return categories;
  }

  public async findByName(name: string) {
    const category: DA.DB.Category | undefined = await knex("categories")
      .where("name", name)
      .first();
    return category;
  }

  public async findById(uuid: string) {
    const category: DA.DB.Category | undefined = await knex("categories")
      .where("id", uuid)
      .first();
    return category;
  }

  public async add(category: DA.Category) {
    if (!category.name) {
      throw new Error("Category name undefined, impossible to continue");
    }
    if (!category.id) {
      category.id = uuidv4();
    }
    await knex("categories").insert(category);
  }

  public async hide(category: DA.DB.Category) {
    await knex("categories").update({ show: false }).where({ id: category.id });
  }

  public async show(category: DA.DB.Category) {
    await knex("categories").update({ show: true }).where({ id: category.id });
  }

  public async rename(category: DA.DB.Category) {
    await knex("categories")
      .update({ name: category.name })
      .where({ id: category.id });
  }
}

export default CategoryManager;
