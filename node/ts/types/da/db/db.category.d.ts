/**
 * Database representation of the Category
 */
declare namespace DA.DB {
  export interface Category extends DA.Category {
    id: DA.Category.id;
    name: DA.Category.name;
    created_at: DA.Category.created_at;
    show: DA.Category.show;
  }
}
