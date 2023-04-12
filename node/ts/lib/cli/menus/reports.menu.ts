import promComp from "../prompt-completition";
import chalk from "chalk";
import balanceAction from "./report.actions/report.action.balance";

// Import actions

async function reportsMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.blue("Reports:"), [
      "balance",
      "sql",
      "category",
      "month",
      "years",
      "exit",
    ]);
    switch (result) {
      case "balance":
        console.clear();
        await balanceAction();
        break;
      case "add":
        console.clear();

        break;
      case "sql":
        console.clear();

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

export default reportsMenu;
