import promComp from "../prompt-completition";
import PayerManager from "../../managers/payer.manager";
import chalk from "chalk";
import outputter from "../outputter";
import promptSequnce from "../prompt-sequence";
import knex from "../../../utils/knex";

async function payersMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.blue("Payers:"), [
      "list",
      "add",
      "rename",
      "exit",
    ]);
    const payerM = new PayerManager();
    switch (result) {
      case "list":
        console.clear();
        let list = await payerM.get();
        outputter.table("Payers List", list);
        break;
      case "add":
        console.clear();
        await addAction();
        break;
      case "rename":
        console.clear();
        await renameAction();
        break;
      case "exit":
        console.clear();
        exit = true;
        break;
      default:
        await outputter.errorAsync("Impossible choise, try again:");
        break;
    }
  } while (!exit);
  return;
}

const addAction = async () => {
  const payerM = new PayerManager();
  let corretName = false;
  do {
    const name = await promComp(chalk.bold.green("Insert payer Name"), []);
    if (!name) continue;
    console.clear();
    const isCorrect = await promComp(
      chalk.bold.green(`Is ${chalk.bold.blue(name)} correct ?`),
      ["y", "n", "exit"]
    );
    console.clear();
    if (["y", "yes"].indexOf(isCorrect) != -1) {
      try {
        await payerM.add({
          name: name,
        });
      } catch (e) {
        if (e instanceof Error) {
          await outputter.errorAsync(e.message);
        } else {
          console.log(e);
        }
      }
      corretName = true;
    }
    if (isCorrect == "exit") {
      //Not really correct name but we need to exit
      corretName = true;
    }
  } while (!corretName);
};

const renameAction = async () => {
  const payerM = new PayerManager();
  const payers = await payerM.get();
  const payersNames = payers.map((payer) => payer.name) as Array<string>;
  const response = (await promptSequnce([
    {
      message: chalk.green("Select the Payer you want to change:"),
      returnKeyName: "oldName",
      possibleAnswers: payersNames || [],
      wrongAnswerMessage: "Name not in list",
      exitAnswerValue: "exit",
      validateAnswer: true,
    },
    {
      message: chalk.green("Insert new name"),
      returnKeyName: "newName",
      pattern: /^[a-zA-Z]{2,50}$/,
      wrongAnswerMessage:
        "The name must contains only alphabetical characters and size between 2 and 50",
      exitAnswerValue: "exit",
      validateAnswer: true,
    },
  ])) as {
    oldName: string;
    newName: string;
  };
  if (response && response.newName && response.oldName) {
    const payer = await payerM.getByName(response.oldName);
    if (payer) {
      payer.name = response.newName;
      payerM.changeName(payer);
    }
  }
};

export default payersMenu;
