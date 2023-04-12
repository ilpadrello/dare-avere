import outputter from "../../outputter";
import TransactionManager from "../../../managers/transaction.manager";
import promptSequnce from "../../prompt-sequence";
import chalk from "chalk";

async function sqlAction() {
  const result = (await promptSequnce([
    {
      message: `This feature makes you filter the list as you want:
Use the where clause of this query to filter the transactions (${chalk.red(
        "'exit'"
      )} to abort):
${chalk.green(
  `SELECT description, amount, date, percent, ${chalk.bold.blue(
    "category (name)"
  )}, ${chalk.bold.blue("payer (name)")}, comment FROM transactions WHERE ...`
)}`,
      returnKeyName: "sql",
      exitAnswerValue: "exit",
    },
  ])) as {
    sql: string;
  };
  if (!result || !result.sql) {
    return;
  }

  const transactionsMan = new TransactionManager();
  outputter.table(
    "Transactions Filtered:",
    await transactionsMan.listViaSql(result.sql)
  );
}

export default sqlAction;
