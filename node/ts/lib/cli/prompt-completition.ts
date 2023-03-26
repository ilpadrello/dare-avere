import chalk from "chalk";
import exp from "node:constants";
import * as readline from "node:readline/promises";

async function promptWithCompletion(
  question: string,
  possibleAnswers: string[]
) {
  const completer = (line: string): [string[], string] => {
    const hits = possibleAnswers.filter((c) => c.startsWith(line));
    return [hits.length ? hits : possibleAnswers, line];
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: completer,
  });
  let text = ``;
  if (possibleAnswers.length > 0) {
    text = `${question}
[ ${chalk.green(possibleAnswers.join(chalk.white(" | ")))} ]
> `;
  } else {
    text = text = `${question}
> `;
  }
  const result = await rl.question(text);
  console.log();
  rl.close();
  return result;
}

export default promptWithCompletion;
