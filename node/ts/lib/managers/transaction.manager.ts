import knex from "../../utils/knex";
import { v4 as uuidv4 } from "uuid";
import CategoryManager from "./category.manager";
import PayerManager from "./payer.manager";
import sanitizeSqlQuery from "../cli/sanitaze-sql";
const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

class TransactionManager {
  constructor() {}

  public async list() {
    const transactions: Array<DA.DB.Transaction> = await knex("transactions")
      .select()
      .orderBy("date", "desc")
      .limit(200);
    return transactions.reverse();
  }

  private async _formatForDisplay(transactions: Array<DA.DB.Transaction>) {
    const payerMan = new PayerManager();
    const categoryMan = new CategoryManager();
    const toReturn = await Promise.all(
      transactions.map(async (transaction) => {
        return {
          payer: (await payerMan.findById(transaction.payer_id))?.name,
          description: transaction.description,
          category: (await categoryMan.findById(transaction.category_id))?.name,
          amount: formatter.format(transaction.amount),
          date: new Date(transaction.date).toISOString().slice(0, 10),
          percent: transaction.percent + " %",
          comment: transaction.comment,
        };
      })
    );
    return toReturn;
  }

  public async listForDisplay() {
    const rawTransactions = await this.list();
    const cateroryMan = new CategoryManager();
    const payerMan = new PayerManager();
    return await this._formatForDisplay(rawTransactions);
  }

  public async listViaSql(sql: string) {
    const query = sanitizeSqlQuery(sql);
    if (!query) {
      return [];
    }
    const result =
      await knex.raw(`SELECT * FROM (SELECT t.description, t.amount, strftime('%Y-%m-%d', datetime(t.date/1000, 'unixepoch')) as date, t.percent, c.name as category, p.name as payer, t.comment FROM transactions t
        JOIN categories c ON c.id = t.category_id 
        JOIN payers p ON p.id = t.payer_id) WHERE ${sql};`);
    return result;
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

  public async getTransactionsOfPayer(payer: DA.Payer) {
    if (!payer.id) return;
    return (await knex("transactions")
      .where({ payer_id: payer.id })
      .select()) as Array<DA.DB.Transaction>;
  }
}

export default TransactionManager;
