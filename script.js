"use strict";

const fromCurrency = document.querySelector('.from select');
const toCurrency = document.querySelector('.to select');
const getBtn = document.querySelector('.container button');
const exIcon = document.querySelector('.reverse');
const amountEl = document.querySelector('form input');
const exRateTxt = document.querySelector('form .result');

const API_KEY = '14b91c3ae80c7360853c3ab5';

// Function to get user input from local storage
function getUserInput() {
  const userInput = JSON.parse(localStorage.getItem('userInput')) || {};
  fromCurrency.value = userInput.fromCurrency || 'USD';
  toCurrency.value = userInput.toCurrency || 'GBP';
  amountEl.value = userInput.amount || '';
}
//terminates here

// Function to save user input to local storage
function saveUserInput() {
  const userInput = {
    fromCurrency: fromCurrency.value,
    toCurrency: toCurrency.value,
    amount: amountEl.value,
  };
  localStorage.setItem('userInput', JSON.stringify(userInput));
}
//terminates here
[fromCurrency, toCurrency].forEach((select, i) => {
  for (let curcode in country_list) {
    const selected =
      (i === 0 && curcode === 'USD') || (i === 1 && curcode === 'GBP')
        ? 'selected'
        : '';

    select.insertAdjacentHTML(
      'beforeend',
      `<option value="${curcode}" ${selected}>${curcode}</option>`
    );
  }

  // Event listener
  select.addEventListener('change', () => {
    const code = select.value;
    const imgTag = select.parentElement.querySelector('img');
    imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    saveUserInput(); // Save user input when selection changes
  });
});

// Get data from API
async function getExchangeRate() {
  const amountValue = amountEl.value;
  exRateTxt.textContent = 'Boss, Please Wait..........';

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`
    );
    const result = await response.json();

    const exRate = result.conversion_rates[toCurrency.value];
    const totalExRate = amountValue * exRate.toFixed(2);
    exRateTxt.textContent = `${amountValue} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;

    console.log(totalExRate);
  } catch (error) {
    exRateTxt.textContent = 'Something Went Wrong...';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  getUserInput(); // Retrieve user input when the page loads
  getExchangeRate();
});

getBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getExchangeRate();
  saveUserInput(); // Save user input when the button is clicked
});

exIcon.addEventListener('click', () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  [fromCurrency, toCurrency].forEach((select) => {
    const code = select.value;
    const imgTag = select.parentElement.querySelector('img');
    imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
  });
  getExchangeRate();
  saveUserInput(); // Save user input when the currency is reversed
});

amountEl.addEventListener('keyup', () => {
  getExchangeRate();
  saveUserInput(); // Save user input when the amount is changed
});
