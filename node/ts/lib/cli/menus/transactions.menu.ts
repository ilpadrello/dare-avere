import promComp from "../prompt-completition";
import chalk from "chalk";

// Import actions
import listAction from "./transactions.actions/transaction.action.list";
import addAction from "./transactions.actions/transaction.action.add";
import sqlAction from "./transactions.actions/transaction.action.sql";

async function transactionMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.blue("Transaction:"), [
      "add",
      "list",
      "sql",
      "import",
      "export",
      "exit",
    ]);
    switch (result) {
      case "list":
        console.clear();
        await listAction();
        break;
      case "add":
        console.clear();
        await addAction();
        break;
      case "sql":
        console.clear();
        await sqlAction();
        break;
      case "import":
        console.clear();
        //await showAction();
        break;
      case "export":
        console.clear();
        break;
      case "exit":
        console.clear();
        exit = true;
        break;
      default:
        console.clear();
        console.log("Impossible choise, try again:");
        break;
    }
  } while (!exit);
  return;
}

export default transactionMenu;
