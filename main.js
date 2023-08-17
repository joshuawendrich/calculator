document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  solve();
});

function solve() {
  const input = document.querySelector('input').value;
  const tokens = tokenize(input);
  solvePart(tokens, '*', '/');
  solvePart(tokens, '+', '-');
  document.querySelector('.solution').innerText = tokens[0];
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
    if (isOperation(character)) tokens.push(character);
  }
  pushNumber(tokens, currentNumberString);
  if (isOperation(tokens[tokens.length - 1])) tokens.pop();
  if (isOperation(tokens[0])) tokens.shift();
  return tokens;
}

function pushNumber(tokens, numberString) {
  if (numberString === '') return;
  tokens.push(parseFloat(numberString));
}

function isOperation(character) {
  return /[-+\*\/]/.test(character);
}

function isNumber(character) {
  return /[0-9.]/.test(character);
}

function add(a, b) {
  return a + b;
}

function calcResultPart(tokens, operationIndex) {
  const operation = tokens[operationIndex];
  const operand1 = tokens[operationIndex - 1];
  const operand2 = tokens[operationIndex + 1];
  let newValue;
  switch (operation) {
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
  tokens.splice(operationIndex - 1, 3, newValue);
}
