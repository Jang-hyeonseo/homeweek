const quotes = [
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
let highScore = localStorage.getItem('highScore') || Infinity;

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const resultModal = document.getElementById('resultModal');
const resultMessage = document.getElementById('result-message');
const highScoreElement = document.getElementById('high-score');
const closeButton = document.querySelector('.close-button');

closeButton.style.display = 'none';

function disableInput() {
  typedValueElement.disabled = true;
  typedValueElement.removeEventListener('input', handleInput);
}

function enableInput() {
  typedValueElement.disabled = false;
  typedValueElement.addEventListener('input', handleInput);
}

function handleInput() {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    const elapsedTimeInSeconds = elapsedTime / 1000;
    const message = `CONGRATULATIONS! You finished in ${elapsedTimeInSeconds} seconds.`;
    messageElement.innerText = message;
    disableInput();
    showResultModal(elapsedTimeInSeconds);
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    typedValueElement.value = '';
    wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    quoteElement.childNodes[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = '';
  } else {
    typedValueElement.className = 'error';
  }
  generateTypingFireworks(typedValueElement);
}

function showResultModal(elapsedTimeInSeconds) {
  resultMessage.innerText = `You finished in ${elapsedTimeInSeconds} seconds.`;
  if (elapsedTimeInSeconds < highScore) {
    highScore = elapsedTimeInSeconds;
    localStorage.setItem('highScore', highScore);
    highScoreElement.innerText = `New High Score: ${highScore} seconds!`;
  } else {
    highScoreElement.innerText = `High Score: ${highScore} seconds.`;
  }
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  document.body.appendChild(overlay);

  overlay.appendChild(resultModal);
  resultModal.style.display = 'flex';
  closeButton.style.display = 'flex';
}

function generateTypingFireworks(input) {
  const { selectionStart, value } = input;
  const { length } = value;
  const { top, left, height } = input.getBoundingClientRect();
  const charDiff = value.length - input.oldValue?.length || 0;
  const charDiffAbs = Math.abs(charDiff);
  let caretPos = selectionStart || 0;

  if (charDiff < 0) {
    caretPos += charDiffAbs;
  }

  for (let c = 0; c < charDiffAbs; ++c) {
    const hue = random(0, 359, true);
    const particles = 20;

    for (let p = 0; p < particles; ++p) {
      const el = document.createElement('div');
      const color = `hsl(${hue}, 90%, 55%)`;
      const x = `calc(${left}px + ${caretPos - c - 0.5}ch)`;
      const y = `${top + height / 2}px`;
      const angle = random(0, 359, true);
      const isRing = p === 0;
      const d = isRing ? random(3, 5) : random(2, 4);

      el.classList.add('particle');

      if (isRing) {
        el.classList.add('particle--ring');
        el.style.color = color;
        el.style.width = `${d}em`;
        el.style.height = `${d}em`;
      } else {
        el.style.backgroundColor = color;
      }

      el.style.top = y;
      el.style.left = x;
      document.body.appendChild(el);

      const center = 'translate(-50%, -50%)';
      const ringKeyframes = [
        { opacity: 1, transform: `${center} scale(0)` },
        { opacity: 0, transform: `${center} scale(1)` }
      ];
      const dotKeyframes = [
        { transform: `${center} rotate(${angle}deg) translateY(0) scale(1)` },
        { transform: `${center} rotate(${angle}deg) translateY(${d}em) scale(0)` }
      ];
      const movement = el.animate(isRing ? ringKeyframes : dotKeyframes, {
        duration: isRing ? 600 : 900,
        easing: 'cubic-bezier(0, 0, 0.13, 1)'
      });

      movement.onfinish = () => {
        el.remove();
      };
    }
  }

  input.oldValue = value;
}

function random(min, max, round = false) {
  const percent = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  const relativeValue = (max - min) * percent;
  return min + (round === true ? Math.round(relativeValue) : +relativeValue.toFixed(2));
}

startButton.addEventListener('click', () => {
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  words = quote.split(' ');
  wordIndex = 0;
  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });
  quoteElement.innerHTML = spanWords.join('');
  quoteElement.childNodes[0].className = 'highlight';
  messageElement.innerText = '';
  typedValueElement.value = '';
  typedValueElement.focus();
  startTime = new Date().getTime();
  enableInput();
});

typedValueElement.addEventListener('input', handleInput);

closeButton.addEventListener('click', () => {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.remove();
  }
  resultModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  const overlay = document.getElementById('modal-overlay');
  if (event.target === overlay) {
    overlay.remove();
    resultModal.style.display = 'none';
  }
});