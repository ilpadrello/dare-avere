import promComp from "../prompt-completition";
import outputter from "../outputter";
import chalk from "chalk";
import TransactionManager from "../../managers/transaction.manager";
import CategoryManager from "../../managers/category.manager";
import promptSequnce from "../prompt-sequence";
import PayerManager from "../../managers/payer.manager";

async function transactionMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.green("Transaction:"), [
      "add",
      "report",
      "list",
      "update",
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
      case "report":
        console.clear();
        //await renameAction();
        break;
      case "update":
        console.clear();
        //await hideAction();
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

async function listAction() {
  const transactionMan = new TransactionManager();
  const transactions = transactionMan.list();
  outputter.table("Transactions:", transactions);
}

async function addAction() {
  const transactionMan = new TransactionManager();
  const payerMan = new PayerManager();
  const payers = await payerMan.get();
  const payersNames = payers.map((payer) => payer.name);
  const result = (await promptSequnce([
    {
      message: "describe your expense:",
      returnKeyName: "description",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message:
        "what is the amount? (format: 0.00) No spaces or Currency needed",
      pattern: /^[0-9]+([,.][0-9]{0,2})?$/,
      returnKeyName: "amount",
      wrongAnswerMessage: "The input is not correct",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message: "Date of the trasaction (format YYYY-MM-DD), default: today",
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      acceptEmpty: true,
      returnKeyName: "date",
      wrongAnswerMessage: "The date format is not correct(format YYYY-MM-DD)",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message: "Who is paying ?",
      possibleAnswers: payersNames,
      returnKeyName: "payerName",
      wrongAnswerMessage: "Please select a correct payer",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message: "What percentage of that you will actually pay (default: 50) ?",
      pattern: /^(?:100(?:[.,]0{1,2})?|\d{1,2}(?:\.\d{1,2})?)$/,
      returnKeyName: "percent",
      acceptEmpty: true,
      wrongAnswerMessage: "Please select a correct percentage (example: 50.00)",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message: "Comment for this transaction ?",
      returnKeyName: "comment",
      acceptEmpty: true,
      exitAnswerValue: "exit",
    },
  ])) as {
    description: string;
    amount: string;
    date: string;
    payerName: string;
    percent: string;
    comment: string;
  };
  console.log(result);
  //result.date = new Date(date);
}

async function renameAction() {
  const categoryMan = new CategoryManager();
  const possibleAnswers = (await categoryMan.getAll()).map((cat) => cat.name);
  const result = (await promptSequnce([
    {
      message: "Choose the Category you want to rename:",
      possibleAnswers: possibleAnswers,
      returnKeyName: "oldName",
      validateAnswer: true,
      exitAnswerValue: "exit",
    },
    {
      message: "What is the new name for this category:",
      pattern: /^[a-zA-Z]{1,50}$/,
      returnKeyName: "newName",
      validateAnswer: true,
      exitAnswerValue: "exit",
    },
  ])) as {
    oldName: string;
    newName: string;
  };
  if (result) {
    const category = await categoryMan.findByName(result.oldName);
    if (category) {
      category.name = result.newName;
      await categoryMan.rename(category);
    }
  }
  console.clear();
}

async function hideAction() {
  const categoryMan = new CategoryManager();
  const possibleAnswers = (await categoryMan.getAll()).map((cat) => cat.name);
  const result = (await promptSequnce([
    {
      message: "Choose the Category you want to hide:",
      possibleAnswers: possibleAnswers,
      returnKeyName: "name",
      validateAnswer: true,
      exitAnswerValue: "exit",
    },
  ])) as {
    name: string;
  };
  if (result) {
    const category = await categoryMan.findByName(result.name);
    if (category) {
      await categoryMan.hide(category);
    }
  }
  console.clear();
}

async function showAction() {
  const categoryMan = new CategoryManager();
  const possibleAnswers = (await categoryMan.getAll()).map((cat) => cat.name);
  const result = (await promptSequnce([
    {
      message: "Choose the Category you want to show:",
      possibleAnswers: possibleAnswers,
      returnKeyName: "name",
      validateAnswer: true,
      exitAnswerValue: "exit",
    },
  ])) as {
    name: string;
  };
  if (result) {
    const category = await categoryMan.findByName(result.name);
    if (category) {
      await categoryMan.show(category);
    }
  }
  console.clear();
}
