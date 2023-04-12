/**
 * Loose representation of a transaction
 */

declare namespace DA {
  export interface Transaction {
    id?: string;
    description?: string;
    amount?: number;
    date?: Date;
    payer?: DA.DB.Payer;
    payer_id?: string; // UUID of the payer;
    category?: DA.DB.Category;
    category_id?: string; // UUID of the category;
    percent?: number; // Percentage of the amount you pay for this transaction
    comment?: string | null;
  }
}
