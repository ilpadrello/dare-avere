import promComp from "../prompt-completition";
import payersMenu from "./payers.menu";
import categoryMenu from "./categories.menu";
import transactionMenu from "./transactions.menu";
import chalk from "chalk";
import outputter from "../outputter";
import reportsMenu from "./reports.menu";

async function mainMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.blue("Menu:"), [
      "reports",
      "transactions",
      "categories",
      "payers",
      "exit",
    ]);
    switch (result) {
      case "reports":
        console.clear();
        await reportsMenu();
        break;
      case "payers":
        console.clear();
        await payersMenu();
        break;
      case "transactions":
        console.clear();
        await transactionMenu();
        break;
      case "categories":
        console.clear();
        await categoryMenu();
        break;
      case "exit":
        console.clear();
        exit = true;
        break;
      default:
        console.clear();
        await outputter.errorAsync(`There is no ${result}, try again:`);
        break;
    }
  } while (!exit);
  return;
}

export default mainMenu;
