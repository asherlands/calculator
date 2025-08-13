const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

let currentExpression = ''; 

function updateDisplay() {
  display.value = currentExpression;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    if (button.id === 'equals' || button.id === 'clear') return;

    const operators = ['+', '-', '*', '/'];
    const lastChar = currentExpression.slice(-1);

    if (operators.includes(value)) {
      if (currentExpression === '' && value !== '-') return;

      if (operators.includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + value;
        updateDisplay();
        return;
      }
    }

    if (value === '.') {
      const parts = currentExpression.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;
    }

    currentExpression += value;
    updateDisplay();
  });
});

clearBtn.addEventListener('click', () => {
  currentExpression = '';
  updateDisplay();
});

equalsBtn.addEventListener('click', () => {
  if (currentExpression === '') return;

  try {
    const result = simpleCalculate(currentExpression);
    currentExpression = String(result);
    updateDisplay();
  } catch (e) {
    display.value = 'Error';
    currentExpression = '';
  }
});

function simpleCalculate(expr) {
  const tokens = expr.match(/(\d+\.?\d*|\.\d+|[\+\-\*\/])/g);

  if (!tokens) throw new Error('Invalid Expression');

  for (let i = 0; i < tokens.length; i++) {
    if (!['+', '-', '*', '/'].includes(tokens[i])) {
      tokens[i] = parseFloat(tokens[i]);
      if (isNaN(tokens[i])) throw new Error('Invalid number');
    }
  }

  let total = tokens[0];

  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const num = tokens[i + 1];

    if (op === '+') total += num;
    else if (op === '-') total -= num;
    else if (op === '*') total *= num;
    else if (op === '/') {
      if (num === 0) throw new Error('Divide by zero');
      total /= num;
    }
  }

  return total;
}
