const game = document.querySelector('#gameWrapper');
const bin = document.querySelector('.bin');
const techs = document.querySelector('#technologiesWrapper');
const collisionPoint = document.querySelector('#binWrapper');
const scoreElement = document.querySelector('.score');
const dropsArray = document.querySelectorAll('.circle-cell');
const modal = document.querySelector('.game-over-modal');

const gameWidth = 1152;
const gameHeight = 730;
const binWidth = parseInt(
  window.getComputedStyle(bin).getPropertyValue('width')
);
const binHeight = 80;
const techWidth = 40;

const techArray = ['angular', 'css', 'javascript', 'react'];

let score = 0;
let drops = 0;
let fallSpeed = 1;
let generatingSpeed = 2400;
let request;
let techTimeout;

let binLeft = parseInt(window.getComputedStyle(bin).getPropertyValue('left'));
let binBottom = parseInt(
  window.getComputedStyle(bin).getPropertyValue('bottom')
);

let binStart = binLeft;

function moveBinLeft() {
  if (binLeft > 0) {
    binLeft -= 30;
    bin.style.left = binLeft + 'px';
  }
}

function moveBinRight() {
  if (binLeft < gameWidth - binWidth) {
    binLeft += 30;
    bin.style.left = binLeft + 'px';
  }
}
function control(e) {
  if (e.key == 'ArrowLeft') moveBinLeft();
  if (e.key == 'ArrowRight') moveBinRight();
}

function incraseScore() {
  score += 100;
  scoreElement.innerHTML = score;
}

function getRandomTech() {
  for (let i = 0; i < techArray.length; i++) {
    let randomIndex = Math.floor(Math.random() * techArray.length);
    let randomTech = techArray[randomIndex];
    return randomTech;
  }
}

function generateTech() {
  if (drops < 3) {
    let techLeft = Math.floor(Math.random() * gameWidth - techWidth);
    let techBottom = gameHeight - techWidth;
    let tech = document.createElement('div');
    tech.setAttribute('class', `collision-object ${getRandomTech()}`);
    tech.style.left = techLeft + 20 + 'px';

    game.appendChild(tech);

    function techFallDown() {
      if (
        techBottom < binBottom + binHeight &&
        techLeft > binLeft - 40 &&
        techLeft < binLeft + 80
      ) {
        if (game.parentNode) {
          game.removeChild(tech);
          incraseScore();
        }
      }
      if (techBottom < binBottom) {
        dropTech(tech);
      } else {
        techBottom -= fallSpeed;
        tech.style.bottom = techBottom + 'px';
        request = requestAnimationFrame(techFallDown);
      }
    }
    techFallDown();

    if (score !== 0 && score % 1000 === 0) {
      speedUp();
    }

    techTimeout = setTimeout(() => {
      generateTech();
    }, generatingSpeed);
  } else GameOver(request, techTimeout);
}

function speedUp() {
  fallSpeed += 1;
  generatingSpeed -= 200;
}

function dropTech(tech) {
  drops++;
  dropsArray[drops - 1].classList.remove('green');
  dropsArray[drops - 1].classList.add('red');
  setTimeout(() => {
    game.removeChild(tech);
  }, 3000);
}

function GameOver(request, techTimeout) {
  cancelAnimationFrame(request);
  clearTimeout(techTimeout);
  let techsArray = document.querySelectorAll('.collision-object');
  techsArray.forEach((element) => {
    element.remove();
  });
  showModal();
}

function showModal() {
  let modalHeading = document.createElement('h1');
  modalHeading.innerHTML = 'GAME OVER';
  modalHeading.style.marginTop = '25px';
  let modalh2 = document.createElement('h2');
  modalh2.innerHTML = `Your score:  ${score}`;
  let buttonRestart = document.createElement('button');
  buttonRestart.innerHTML = 'Restart';
  buttonRestart.addEventListener('click', restart);
  modal.style.border = '2px';

  modal.appendChild(modalHeading);
  modal.appendChild(modalh2);
  modal.appendChild(buttonRestart);
  modal.classList.remove('hidden');
}

function restart() {
  drops = 0;
  score = 0;
  modal.classList.add('hidden');
  modal.innerHTML = '';
  fallSpeed = 1;
  generatingSpeed = 2400;

  dropsArray.forEach((element) => {
    element.classList.add('green');
  });
  binStartPosition();
  generateTech();
}

function binStartPosition() {
  bin.style.left = binStart + 'px';
  binLeft = binStart;
}

generateTech();
document.addEventListener('keydown', control);
