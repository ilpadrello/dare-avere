import knex from "../../utils/knex";
import { v4 as uuidv4 } from "uuid";
import outputter from "../cli/outputter";

class TransactionManager {
  constructor() {}

  public async list() {
    const transactions: Array<DA.DB.Transaction> = await knex(
      "transactions"
    ).select();
    return transactions;
  }

  public async add(transaction: DA.Transaction) {
    transaction = { ...transaction };
    if (
      !("amount" in transaction) ||
      !transaction.date ||
      !transaction.percent ||
      (!transaction.category && !transaction.category_id) ||
      (!transaction.payer && !transaction.payer_id)
    ) {
      throw new Error("More info are required in order to add a transaction");
    }
    if (!transaction.id) {
      transaction.id = uuidv4();
    }
    if (transaction.category && !transaction.category_id) {
      transaction.category_id = transaction.category.id;
    }
    delete transaction.category;

    if (transaction.payer && !transaction.payer_id) {
      transaction.payer_id = transaction.payer.id;
    }
    delete transaction.payer;
    await knex("transactions").insert(transaction);
  }
}

export default TransactionManager;
