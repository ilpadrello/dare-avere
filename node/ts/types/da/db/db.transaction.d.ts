/**
 * Database representation of a transaction
 */

declare namespace DA.DB {
  export interface Transaction extends DA.Transaction {
    id: DA.Transaction.id;
    description: DA.Transaction.description;
    amount: DA.Transaction.amount;
    date: DA.Transaction.date;
    category_id: DA.Transaction.category_id;
    payer_id: DA.Transaction.payer; // UUID of the payer;
    percent: DA.Transaction.percent; // Percentage of the amount you pay for this transaction
    comment: DA.Transaction.comment;
  }
}
