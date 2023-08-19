document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  solve();
});

function solve() {
  const input = document.querySelector('input').value;
  const tokens = tokenize(input);
  solvePart(tokens, '*', '/', '^');
  solvePart(tokens, '+', '-');
  document.querySelector('.solution').innerText = tokens[0];
}

function solvePart(tokens, ...operators) {
  while (tokens.some((t) => operators.some((o) => t === o))) {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (operators.includes(token)) {
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
    if (!isNumber(character) && !isOperator(character)) continue;
    if (isNumber(character)) {
      currentNumberString += character;
    } else {
      pushNumber(tokens, currentNumberString);
      currentNumberString = '';
    }
    if (isOperator(character)) {
      if (tokens.length !== 0 && !isOperator(tokens[tokens.length - 1])) {
        tokens.push(character);
      } else if (character === '-') {
        currentNumberString += character;
      }
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
  return /[-+\*\/^]/.test(character) && typeof character === 'string';
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
    case '^':
      newValue = operand1;
      for (let i = 1; i < operand2; i++) {
        newValue *= operand1;
      }
      break;
  }
  tokens.splice(operatorIndex - 1, 3, newValue);
}
