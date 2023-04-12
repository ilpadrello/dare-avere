import outputter from "../../outputter";
import TransactionManager from "../../../managers/transaction.manager";

async function listAction() {
  const transactionMan = new TransactionManager();
  const transactions = await transactionMan.listForDisplay();
  outputter.table("Transactions:", transactions);
}

export default listAction;
