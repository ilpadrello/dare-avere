import promptWithCompletion from "./prompt-completition";
import outputter from "./outputter";
import chalk from "chalk";

interface seq_elem {
  returnKeyName: string; // The name of the key that will be returned to you (should be unique)
  message: string; // The message you want to show
  possibleAnswers?: Array<string>; // A list of limited possible answers
  pattern?: RegExp; // The answer should follow this pattern to be correct
  correct?: Array<string> | string | undefined; // A list, or just a answer that is considered correct
  dontRepeatIfWrong?: boolean; // If the anwser is wrong you can choose not to repeat!
  acceptEmpty?: boolean; // Accept an empty string as response
  wrongAnswerMessage?: string; // If the anwser is wrong show this message
  dontClear?: boolean; // Don't clear the screen during the whole process
  validateAnswer?: boolean; // If this is true, another question will be asked to make sure the anwser is the correct one
  exitAnswerValue?: string; // you can set an anwser that will terminate all the sequence and return nothing
}
const promptSequnce = async (sequence: Array<seq_elem>) => {
  const toReturn: {
    [keyName: string]: string;
  } = {};
  let outOfFor = false;
  for (let i = 0; i < sequence.length; i++) {
    let exit = false;
    do {
      const seq = sequence[i];
      if (seq.exitAnswerValue && seq.possibleAnswers) {
        seq.possibleAnswers.push(seq.exitAnswerValue);
      }
      const res = await promptWithCompletion(
        seq.message,
        seq.possibleAnswers || []
      );
      if (!res) {
        if (!seq.acceptEmpty) {
          continue;
        }
      }
      if (res === seq.exitAnswerValue) {
        outOfFor = true;
        break;
      }
      let correct = false;
      if (
        seq.correct &&
        ((Array.isArray(seq.correct) && seq.correct.length > 0) ||
          typeof seq.correct === "string")
      ) {
        if (Array.isArray(seq.correct)) {
          if (seq.correct.indexOf(res) !== -1) {
            correct = true;
          }
        }
        if (typeof seq.correct === "string") {
          if (seq.correct.toLowerCase() === res.toLowerCase()) {
            correct = true;
          }
        }
      } else if (seq.pattern) {
        if (seq.pattern.test(res)) {
          correct = true;
        }
      } else if (seq.possibleAnswers) {
        if (seq.possibleAnswers.indexOf(res) !== -1) {
          correct = true;
        }
      } else {
        //No Pattern no correct asnwser no possible answers!
        correct = true;
      }
      if (seq.acceptEmpty && res === "") {
        correct = true;
      }
      if (correct) {
        if (seq.validateAnswer) {
          if (!(await validateAnswer(res))) {
            continue;
          }
        }
        toReturn[seq.returnKeyName] = res;
        exit = true;
      } else {
        if (seq.dontRepeatIfWrong) {
          exit = true;
        } else {
          if (seq.wrongAnswerMessage) {
            console.clear();
            await outputter.errorAsync(seq.wrongAnswerMessage);
          }
          continue;
        }
      }
      if (!("dontClear" in seq) || seq.dontClear === false) {
        console.clear();
      }
    } while (!exit);
    if (outOfFor) {
      break;
    }
  }
  if (outOfFor) {
    return;
  }
  return toReturn;
};

async function validateAnswer(value: string) {
  console.clear();
  const isCorrect = await promptWithCompletion(
    chalk.bold.green(
      `You answered ${chalk.bold.blue(value)}, is that correct ?`
    ),
    ["y", "n"]
  );
  console.clear();
  if (["y", "yes"].indexOf(isCorrect) != -1) {
    return true;
  }
  return false;
}

export default promptSequnce;
