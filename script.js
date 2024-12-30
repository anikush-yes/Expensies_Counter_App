// Pasirenkame DOM elementus
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseButton = document.getElementById('add-expense');
const totalAmountElement = document.getElementById('total-amount');
const expenseList = document.getElementById('expense-list');

// Patikriname, ar yra išlaidų duomenys localStorage ir juos užkrauname
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];  // Jei nėra duomenų, naudojame tuščią masyvą

// Funkcija pridėti išlaidą
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    // Patikriname, ar įvesti duomenys yra tinkami
    if (name === '' || isNaN(amount) || amount <= 0) {
        alert('Prašome įvesti tinkamus duomenis.');
        return;
    }

    // Sukuriame objektą su išlaidomis
    const expense = {
        name: name,
        amount: amount
    };

    // Pridedame išlaidą į masyvą
    expenses.push(expense);

    // Išsaugome išlaidas į localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Atnaujiname bendrą sumą
    updateTotalAmount();

    // Atnaujiname sąrašą
    renderExpenseList();

    // Išvalome laukus
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

// Funkcija atnaujinti bendrą sumą
function updateTotalAmount() {
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Funkcija atvaizduoti išlaidų sąrašą
function renderExpenseList() {
    expenseList.innerHTML = '';  // Išvalome sąrašą

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name}: €${expense.amount.toFixed(2)} 
            <button onclick="editExpense(${index})">Redaguoti</button>
            <button onclick="deleteExpense(${index})">Šalinti</button>
        `;
        expenseList.appendChild(li);
    });
}

// Funkcija redaguoti išlaidą
function editExpense(index) {
    const expense = expenses[index];
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;

    // Pašaliname išlaidas ir išsaugome pakeitimus
    addExpenseButton.textContent = 'Atnaujinti išlaidą';

    // Keičiam pridėjimo funkciją į atnaujinimo funkciją
    addExpenseButton.removeEventListener('click', addExpense);
    addExpenseButton.addEventListener('click', function() {
        updateExpense(index);
    });
}

// Funkcija atnaujinti išlaidą
function updateExpense(index) {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    // Patikriname, ar įvesti duomenys yra tinkami
    if (name === '' || isNaN(amount) || amount <= 0) {
        alert('Prašome įvesti tinkamus duomenis.');
        return;
    }

    expenses[index].name = name;
    expenses[index].amount = amount;

    // Išsaugome atnaujintas išlaidas į localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Atnaujiname bendrą sumą
    updateTotalAmount();

    // Atnaujiname sąrašą
    renderExpenseList();

    // Išvalome laukus ir grąžiname mygtuką į pradinę būseną
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    addExpenseButton.textContent = 'Pridėti išlaidą';

    addExpenseButton.removeEventListener('click', updateExpense);
    addExpenseButton.addEventListener('click', addExpense);
}

// Funkcija pašalinti išlaidą
function deleteExpense(index) {
    expenses.splice(index, 1);  // Pašaliname išlaidą iš masyvo

    // Išsaugome atnaujintą sąrašą į localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Atnaujiname bendrą sumą
    updateTotalAmount();

    // Atnaujiname sąrašą
    renderExpenseList();
}

// Pridėti išlaidą paspaudus mygtuką
addExpenseButton.addEventListener('click', addExpense);

// Papildomas funkcionalumas, jei norite naudoti Enter klavišą
expenseAmountInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addExpense();
    }
});

// Iš karto įkeliame išlaidas ir bendrą sumą, kai puslapis įkeltas
document.addEventListener('DOMContentLoaded', function() {
    updateTotalAmount();
    renderExpenseList();
});