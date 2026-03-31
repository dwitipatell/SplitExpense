// Equal split function
export function splitEqual(amount, people) {
  const share = amount / people.length;

  return people.map(person => ({
    name: person,
    owes: share
  }));
}

// ✅ TEST CODE (must be BELOW function)
const result = splitEqual(1000, ["A", "B", "C"]);
console.log("Split Result:", result);