const board = document.querySelector('.board');
const squares = document.querySelectorAll('.square');
const timeLeftDisplay = document.getElementById('time-left');
const resultDisplay = document.getElementById('result');
const levelDisplay = document.getElementById('level');
const playButton = document.getElementById('play');
const arrows = Array.from(document.querySelectorAll('.arrow'));
const logsTop = document.querySelectorAll('.river-left');
const logsBottom = document.querySelectorAll('.river-right');
const carsLeft = document.querySelectorAll('.road-left');
const carsRight = document.querySelectorAll('.road-right');

let width = 9;
let lockBoard = false;
let startIndex = 74;
let currentIndex = startIndex;
let startTime = 20;
let currentTime;
let timerIdTime;

let startLevel = 1;
levelDisplay.textContent = startLevel;
let currentLevel;
let previousLevel;
let maxLevel = 3;

let timerIdLogsTop;
let timerIdLogsBottom;
let timerIdCarsLeft;
let timerIdCarsRight;

let startLogsTopDelay = 1000;
let startLogsBottomDelay = 900;
let startCarsLeftDelay = 900;
let startCarsRightDelay = 1000;

let logsTopDelay;
let logsBottomDelay;
let carsLeftDelay;
let carsRightDelay;


// keys/click updating current index
function arrowPressed(arrow) {
    switch(arrow) {
        case ('ArrowLeft'):
        case ('arrow-left'):
            if(currentIndex % width !== 0) {
                currentIndex -= 1;
            }
            break;
        case ('ArrowRight'):
        case ('arrow-right'):
            if(currentIndex % width < width - 1) {
                currentIndex += 1;
            }
            break;
        case ('ArrowUp'):
        case ("arrow-up"):
            if(currentIndex - width >= 0) {
                currentIndex -= width;
            }
            break;
        case ('ArrowDown'):
        case ('arrow-down'):
            if(currentIndex + width < width * width) {
                currentIndex += width;
            }
            break;
    }
}

// remove frog and assign it again at current index
function moveFrog(e) {
    squares[currentIndex].classList.remove('frog');
    
    if(e.key) {
        arrowPressed(e.key)
    } else {
        arrowPressed(e.target.id)
    }

    squares[currentIndex].classList.add('frog');
}

// move logs, each row on separate timer, need to go the same direction
function moveTopLogs() {
    logsTop.forEach(logTop => moveLogs(logTop));
    checkStatus();
}

function moveBottomLogs() {
    logsBottom.forEach(logBottom => moveLogs(logBottom));
    checkStatus();
}

function moveLogs(log) {
    switch(true) {
        case log.classList.contains('log1'):
            log.classList.remove('log1');
            log.classList.add('log2');
            break;
        case log.classList.contains('log2'):
            log.classList.remove('log2');
            log.classList.add('log3');
            break;
        case log.classList.contains('log3'):
            log.classList.remove('log3');
            log.classList.add('log4');
            break;
        case log.classList.contains('log4'):
            log.classList.remove('log4');
            log.classList.add('log5');
            break;
        case log.classList.contains('log5'):
            log.classList.remove('log5');
            log.classList.add('log1');
            break;
    }
}

// move cars
function moveCarsLeft() {
    carsLeft.forEach(carLeft => {
        switch(true) {
            case carLeft.classList.contains('car1'):
                carLeft.classList.remove('car1');
                carLeft.classList.add('car2');
                break;
            case carLeft.classList.contains('car2'):
                carLeft.classList.remove('car2');
                carLeft.classList.add('car3');
                break;
            case carLeft.classList.contains('car3'):
                carLeft.classList.remove('car3');
                carLeft.classList.add('car1');
                break;
        }
    });
    checkStatus();
}

function moveCarsRight() {
    carsRight.forEach(carRight => {
        switch(true) {
            case carRight.classList.contains('car1'):
                carRight.classList.remove('car1');
                carRight.classList.add('car3');
                break;
            case carRight.classList.contains('car3'):
                carRight.classList.remove('car3');
                carRight.classList.add('car2');
                break;
            case carRight.classList.contains('car2'):
                carRight.classList.remove('car2');
                carRight.classList.add('car1');
                break;
        }
    });
    checkStatus();
}

function lose() {
    if(
        // check if frog fell in the water
        squares[currentIndex].classList.contains('log4') || 
        squares[currentIndex].classList.contains('log5') || 
        // or gets hit by a car
        squares[currentIndex].classList.contains('car1')
        ) {

        resultDisplay.textContent = 'Oops!';
        cleanUp();
        squares[currentIndex].classList.remove('frog');      
    }
}

function win() {
    if(squares[currentIndex].classList.contains('finish')) {
        
        cleanUp();
        currentLevel++;
        
        if(currentLevel <= maxLevel) {

            previousLevel = currentLevel - 1;
            playGame();

            // update values
            resultDisplay.textContent = 'Great! Next level started';
            
                // 5 seconds less time with each level
            currentTime -= previousLevel * 5;
            timeLeftDisplay.textContent = currentTime;

                // 1 second less delay with each level
            logsTopDelay -= previousLevel * 100;
            logsBottomDelay -= previousLevel * 100;
            carsLeftDelay -= previousLevel * 100;
            carsRightDelay -= previousLevel * 100;

                // update & show current level
            currentLevel = previousLevel + 1;
            levelDisplay.textContent = currentLevel;

        } else {
            resultDisplay.textContent = 'You are the absolute winner!';
            cleanUp();
        }
    }
}

// check for loses and wins
function checkStatus() {
    lose();
    win();
}

function timeLeft() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;
    if(currentTime === 0) {
        result.textContent = 'Too late!'
        cleanUp();
    }
}

// clear intervals, eventListeners, unlock board
function cleanUp() {
    clearInterval(timerIdLogsTop);
    clearInterval(timerIdLogsBottom);
    clearInterval(timerIdCarsLeft);
    clearInterval(timerIdCarsRight);
    clearInterval(timerIdTime);
    document.removeEventListener('keydown', moveFrog);
    arrows.forEach(arrow => arrow.removeEventListener('click', moveFrog));
    lockBoard = false;
}

function playGame() {
    if(lockBoard === false) {
        // reset to starting values
        timeLeftDisplay.textContent = startTime;
        currentTime = startTime;
        
        resultDisplay.textContent = '';

        levelDisplay.textContent = startLevel;
        currentLevel = startLevel;
        
        logsTopDelay = startLogsTopDelay;
        logsBottomDelay = startLogsBottomDelay;
        carsLeftDelay = startCarsLeftDelay;
        carsRightDelay = startCarsRightDelay;

        // frog needs to be removed after a win
        squares[currentIndex].classList.remove('frog'); 

        // set frog back to start again
        currentIndex = startIndex;
        squares[currentIndex].classList.add('frog');

        document.addEventListener('keydown', moveFrog);
        arrows.forEach(arrow => arrow.addEventListener('click', moveFrog));

        // start timers
        timerIdLogsTop = setInterval(moveTopLogs, logsTopDelay);
        timerIdLogsBottom = setInterval(moveBottomLogs, logsBottomDelay);
        timerIdCarsLeft = setInterval(moveCarsLeft, carsLeftDelay);
        timerIdCarsRight = setInterval(moveCarsRight, carsRightDelay);
        timerIdTime = setInterval(timeLeft, 1000);

        lockBoard = true;
    }
}

playButton.addEventListener('click', playGame);