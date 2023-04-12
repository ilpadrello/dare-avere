import CategoryManager from "../../../managers/category.manager";
import PayerManager from "../../../managers/payer.manager";
import TransactionManager from "../../../managers/transaction.manager";
import outputter from "../../outputter";
import promptSequnce from "../../prompt-sequence";

async function addAction() {
  const transactionMan = new TransactionManager();
  const payerMan = new PayerManager();
  const categoryMan = new CategoryManager();
  const payers = await payerMan.get();
  const payersNames = payers.map((payer) => payer.name);
  const categories = await categoryMan.getShown();
  const categoriesNames = categories.map((category) => category.name);
  const result = (await promptSequnce([
    {
      message: "describe your expense:",
      returnKeyName: "description",
      exitAnswerValue: "exit",
      dontClear: true,
    },
    {
      message: "Choose a category: ",
      possibleAnswers: categoriesNames,
      returnKeyName: "categoryName",
      wrongAnswerMessage: "Please select a correct category",
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
    categoryName: string;
    amount: string;
    date: string;
    payerName: string;
    percent: string;
    comment: string;
  };
  if (!result) {
    return;
  }
  const payer = await payerMan.getByName(result.payerName);
  const category = await categoryMan.findByName(result.categoryName);
  if (!result.percent) {
    result.percent = "50";
  }
  const transaction: DA.Transaction = {
    description: result.description,
    category: category,
    amount: parseFloat(result.amount.replace(",", ".")),
    date: result.date ? new Date(result.date) : new Date(),
    payer: payer,
    percent: parseFloat(result.percent.replace(",", ".")),
    comment: result.comment || null,
  };
  console.log(transaction);
  await transactionMan.add(transaction);
  await outputter.successAsync(`Transition added with success`);
  console.clear();
}

export default addAction;
