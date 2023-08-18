document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  solve();
});

function solve() {
  const input = document.querySelector('input').value;
  const tokens = tokenize(input);
  createNegativeNumbers(tokens);
  solvePart(tokens, '*', '/');
  solvePart(tokens, '+', '-');
  document.querySelector('.solution').innerText = tokens[0];
}

function createNegativeNumbers(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (
      token === '-' &&
      (i === 0 || isOperator(tokens[i - 1])) &&
      typeof tokens[i + 1] === 'number'
    ) {
      tokens.splice(i, 2, tokens[i + 1] * -1);
    }
  }
}

function solvePart(tokens, operator1, operator2) {
  while (tokens.includes(operator1) || tokens.includes(operator2)) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === operator1 || token === operator2) {
        calcResultPart(tokens, i);
        break;
      }
    }
  }
}

function tokenize(text) {
  let tokens = [];
  let currentNumberString = '';
  for (let i = 0; i < text.length; i++) {
    const character = text.charAt(i);
    if (isNumber(character)) {
      currentNumberString += character;
    } else {
      pushNumber(tokens, currentNumberString);
      currentNumberString = '';
    }
    if (isOperator(character) && (tokens.length !== 0 || character === '-')) {
      tokens.push(character);
    }
  }
  pushNumber(tokens, currentNumberString);
  if (isOperator(tokens[tokens.length - 1])) tokens.pop();
  return tokens;
}

function pushNumber(tokens, numberString) {
  if (numberString === '') return;
  tokens.push(parseFloat(numberString));
}

function isOperator(character) {
  return /[-+\*\/]/.test(character);
}

function isNumber(character) {
  return /[0-9.]/.test(character);
}

function add(a, b) {
  return a + b;
}

function calcResultPart(tokens, operatorIndex) {
  const operator = tokens[operatorIndex];
  const operand1 = tokens[operatorIndex - 1];
  const operand2 = tokens[operatorIndex + 1];
  let newValue;
  switch (operator) {
    case '+':
      newValue = operand1 + operand2;
      break;
    case '-':
      newValue = operand1 - operand2;
      break;
    case '*':
      newValue = operand1 * operand2;
      break;
    case '/':
      newValue = operand1 / operand2;
      break;
  }
  tokens.splice(operatorIndex - 1, 3, newValue);
}
