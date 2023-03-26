import promComp from "../prompt-completition";
import outputter from "../outputter";
import chalk from "chalk";
import CategoryManager from "../../managers/category.manager";
import promptSequnce from "../prompt-sequence";

async function categoryMenu() {
  let exit = false;
  do {
    const result = await promComp(chalk.bold.blue("Categories:"), [
      "list",
      "add",
      "rename",
      "hide",
      "show",
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
      case "rename":
        console.clear();
        await renameAction();
        break;
      case "hide":
        console.clear();
        await hideAction();
        break;
      case "show":
        console.clear();
        await showAction();
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

export default categoryMenu;

async function listAction() {
  const categoryMan = new CategoryManager();
  const allCat = await categoryMan.getAll();
  const categories = allCat.map((cat) => {
    return {
      name: cat.name,
      show: cat.show,
    };
  });
  outputter.table("CATEGORIES", categories);
}

async function addAction() {
  const categoryMan = new CategoryManager();
  const result = (await promptSequnce([
    {
      message: "Choose a Name for you category",
      returnKeyName: "name",
      validateAnswer: true,
      pattern: /^[a-zA-Z]{1,50}$/,
      exitAnswerValue: "exit",
    },
  ])) as {
    name: string;
  };
  if (result.name) {
    categoryMan.add({
      name: result.name,
    });
  }
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
