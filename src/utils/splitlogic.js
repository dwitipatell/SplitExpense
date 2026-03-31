// 🔹 1. Equal split
export function splitEqual(amount, people) {
  const share = amount / people.length;

  return people.map(person => ({
    name: person,
    owes: share
  }));
}


// 🔹 2. Split with payer (core logic)
export function splitWithPayer(amount, people, paidBy) {
  const share = amount / people.length;

  return people.map(person => {
    if (person === paidBy) {
      return {
        name: person,
        balance: amount - share   // gets money
      };
    } else {
      return {
        name: person,
        balance: -share          // owes money
      };
    }
  });
}


// 🔥 3. Final: Who pays whom (IMPORTANT)
export function simplifyDebts(balances) {
  const debtors = [];
  const creditors = [];

  // separate people
  balances.forEach(person => {
    if (person.balance < 0) {
      debtors.push({ ...person });
    } else if (person.balance > 0) {
      creditors.push({ ...person });
    }
  });

  const transactions = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(-debtor.balance, creditor.balance);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: amount
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (debtor.balance === 0) i++;
    if (creditor.balance === 0) j++;
  }

  return transactions;
}


// 🧪 TESTING

const people = ["A", "B", "C"];
const amount = 900;
const paidBy = "A";

const balances = splitWithPayer(amount, people, paidBy);
console.log("Balances:", balances);

const transactions = simplifyDebts(balances);
console.log("Transactions:", transactions);