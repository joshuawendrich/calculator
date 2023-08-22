document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  solve();
});

function solve() {
  const input = document.querySelector('input').value;
  const tokens = tokenize(input);
  if (countToken(tokens, '(') !== countToken(tokens, ')')) return;
  solvePartsInBrackets(tokens);
  solveParts(tokens);
  document.querySelector('.solution').innerText = tokens[0];
}

function solvePartsInBrackets(tokens) {
  while (tokens.includes('(')) {
    const [startIndex, endIndex] = findBracketIndices(tokens);
    const innerTokens = tokens.splice(startIndex, endIndex + 1 - startIndex);
    innerTokens.pop();
    innerTokens.shift();
    solveParts(innerTokens);
    tokens.splice(startIndex, 0, innerTokens[0]);
  }
}

function findBracketIndices(tokens) {
  for (let start = 0; start < tokens.length; start++) {
    const token = tokens[start];
    if (token === '(') {
      for (let end = start + 1; end < tokens.length; end++) {
        const endToken = tokens[end];
        if (isBracket(endToken)) {
          if (endToken === ')') {
            return [start, end];
          }
          break;
        }
      }
    }
  }
}

function solveParts(tokens) {
  solvePart(tokens, '*', '/', '^');
  solvePart(tokens, '+', '-');
}

function countToken(tokens, token) {
  return tokens.reduce((prev, cur) => {
    if (cur === token) return prev + 1;
    return prev;
  }, 0);
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
    if (!isNumber(character) && !isOperator(character) && !isBracket(character))
      continue;
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
    if (isBracket(character)) tokens.push(character);
  }
  pushNumber(tokens, currentNumberString);
  if (isOperator(tokens[tokens.length - 1])) tokens.pop();
  return tokens;
}

function pushNumber(tokens, numberString) {
  if (numberString === '') return;
  tokens.push(parseFloat(numberString));
}

function isBracket(character) {
  return character === '(' || character === ')';
}

function isOperator(character) {
  return /[-+\*\/^]/.test(character) && typeof character === 'string';
}

function isNumber(character) {
  return /[0-9.]/.test(character);
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
      newValue = Math.pow(operand1, operand2);
      break;
  }
  tokens.splice(operatorIndex - 1, 3, newValue);
}
