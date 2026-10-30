const currency = "₹";
const descInput = document.getElementById("desc-input");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const categoryInput = document.getElementById("category-input");
const addBtn = document.getElementById("add-btn");
const expenseBody = document.getElementById("expense-body");
const totalSpentEl = document.getElementById("total-spent");
const totalNoteEl = document.getElementById("total-note");
const weekSpentEl = document.getElementById("week-spent");
const weekNoteEl = document.getElementById("week-note");
const topCategoryEl = document.getElementById("top-category");
const topNoteEl = document.getElementById("top-note");

let expenses = [];

function renderExpenses() {
  expenseBody.innerHTML = "";

  expenses.forEach(function (expense) {
    expenseBody.innerHTML += `
      <tr>
        <td>${expense.date}</td>
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>₹${expense.amount}</td>
        <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
      </tr>
    `;
  });
  renderStats();
}

addBtn.addEventListener("click", function () {
  const description = descInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const category = categoryInput.value;

  if (description === "" || amount <= 0 || date === "") {
    alert("Description, amount aur date sahi se bharo");
    return;
  }

  const expense = {
    id: Date.now(),
    description: description,
    amount: amount,
    date: date,
    category: category,
  };

  expenses.push(expense);
  renderExpenses();

  descInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
});

expenseBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    expenses = expenses.filter(function (expense) {
      return expense.id !== id;
    });
    renderExpenses();
  }
});

function renderStats() {
  // 1. Total
  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);
  totalSpentEl.textContent = currency + total;
  totalNoteEl.textContent = expenses.length + " expenses";

  // 2. Pichle 7 din
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const weekTotal = expenses
    .filter(function (expense) {
      const d = new Date(expense.date);
      return d >= weekAgo && d <= now;
    })
    .reduce(function (sum, expense) {
      return sum + expense.amount;
    }, 0);

  weekSpentEl.textContent = currency + weekTotal;
  weekNoteEl.textContent = currency + Math.round(weekTotal / 7) + " per day";

  // 3. Top category
  const totals = {};
  expenses.forEach(function (expense) {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  });

  let topName = "-";
  let topAmount = 0;
  for (const name in totals) {
    if (totals[name] > topAmount) {
      topName = name;
      topAmount = totals[name];
    }
  }

  topCategoryEl.textContent = topName;
  if (total > 0) {
    const percent = Math.round((topAmount / total) * 100);
    topNoteEl.textContent =
      currency + topAmount + ", " + percent + "% of total spending";
  } else {
    topNoteEl.textContent = "No expenses yet";
  }
}
renderExpenses();
