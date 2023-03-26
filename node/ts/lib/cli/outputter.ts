import chalk from "chalk";
import promptCompletion from "./prompt-completition";
const logger = {
  log: (message: string) => {
    console.log(message);
  },
  table: (message: string, payload: object) => {
    console.clear();
    console.log(chalk.bold.bgGreen(message));
    console.table(payload);
  },
  errorAsync: async (message: string) => {
    console.clear();
    await promptCompletion(chalk.bold.bgRed(message), ["(Press Enter)"]);
    console.clear();
  },
};

export default logger;
