// 🔹 1. Equal split
export function splitEqual(amount, people) {
const share = parseFloat((amount / people.length).toFixed(2));
  return people.map(person => ({
    name: person,
    owes: share
  }));
}


// 🔹 2. Split with payer (core logic)
export function splitWithPayer(amount, people, paidBy) {
const share = parseFloat((amount / people.length).toFixed(2));
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
      amount: parseFloat(amount.toFixed(2))    
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (debtor.balance === 0) i++;
    if (creditor.balance === 0) j++;
  }

  return transactions;
}

// 🔥 4. Multiple expenses support
export function calculateGroupBalances(expenses, people) {
  const balances = {};

  // Step 1: initialize
  people.forEach(person => {
    balances[person] = 0;
  });

  // Step 2: loop all expenses
  expenses.forEach(expense => {
    const amount = expense.amount;
    const paidBy = expense.paidBy;

    const share = amount / people.length;

    people.forEach(person => {
      if (person === paidBy) {
        balances[person] += amount - share;
      } else {
        balances[person] -= share;
      }
    });
  });

  // Step 3: convert to array
  return Object.keys(balances).map(name => ({
    name: name,
    balance: balances[name]
  }));
}

// 🧪 TESTING
// 🧪 TESTING MULTIPLE EXPENSES

const people = ["A", "B", "C"];

const expenses = [
  { amount: 900, paidBy: "A" },
  { amount: 300, paidBy: "B" }
];

// Step 1: group balances
const groupBalances = calculateGroupBalances(expenses, people);
console.log("Group Balances:", groupBalances);

// Step 2: simplify
const finalTransactions = simplifyDebts(groupBalances);
console.log("Final Transactions:", finalTransactions);