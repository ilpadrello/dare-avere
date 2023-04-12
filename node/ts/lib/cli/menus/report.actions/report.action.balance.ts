import chalk from "chalk";
import CategoryManager from "../../../managers/category.manager";
import PayerManager from "../../../managers/payer.manager";
import TransactionManager from "../../../managers/transaction.manager";

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

interface BasicObj {
  [key: string]: string;
}

interface Balance {
  "total spent"?: BasicObj;
}

//Managers
const payerMan = new PayerManager();
const transactionMan = new TransactionManager();
const categoryMan = new CategoryManager();

async function balanceAction() {
  const payers = await payerMan.get();
  const categories = await categoryMan.getAll();

  if (!payers || payers.length < 2) {
    console.log("Not enought payers");
    return;
  }
  const payerA = payers[0];
  const payerB = payers[1];

  const transactionsA = await transactionMan.getTransactionsOfPayer(payerA);
  const transactionsB = await transactionMan.getTransactionsOfPayer(payerB);

  if (
    !transactionsA ||
    !transactionsB ||
    transactionsA.length < 2 ||
    transactionsB.length < 2
  ) {
    console.log(chalk.red("All payers must have at least two transactions"));
    return;
  }

  console.table({
    test: { ciao: "mamma", come: "va", sei: "hello" },
    test2: { ciao: "mamma", come: "va", sei: "hello" },
  });

  const totalSpent: BasicObj = {};
  totalSpent[payerA.name] = formatter.format(
    transactionsA.reduce((accumulator, current) => {
      return accumulator.amount + current.amount;
    }) as unknown as number
  );
  totalSpent[payerB.name] = formatter.format(
    transactionsB.reduce((accumulator, current) => {
      return accumulator.amount + current.amount;
    }) as unknown as number
  );

  const balance: Balance = {
    "total spent": totalSpent,
  };
  console.table(balance);
}

export default balanceAction;
