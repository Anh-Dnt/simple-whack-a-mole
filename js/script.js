// script.js
const squares = document.querySelectorAll('.square');
const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#startButton');
const timeLeftDisplay = document.querySelector('#timeLeft');
const volumeDownButton = document.querySelector('#volumeDown');
const volumeUpButton = document.querySelector('#volumeUp');
const scoreboard = document.querySelector('#scoreboard');
const scoreList = document.querySelector('#scoreList');
const moleHitSound = new Audio('./sound/mole-hit.mp3');
const backgroundMusic = new Audio('./sound/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Default volume

let score = 0;
let hitPosition;
let timerId = null;
let gameTime = 30; // Set game time to 30 seconds
let countdownTimerId = null;
let lastScores = getScoresFromCookies() || [];

function randomSquare() {
    squares.forEach(square => {
        square.classList.remove('mole');
        square.classList.add('hole');
    });
    let randomSquare = squares[Math.floor(Math.random() * squares.length)];
    randomSquare.classList.remove('hole');
    randomSquare.classList.add('mole');
    hitPosition = randomSquare.id;
}

squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (square.id === hitPosition) {
            score++;
            scoreDisplay.textContent = score;
            square.classList.add('hit');
            moleHitSound.play(); // Play hit sound
            setTimeout(() => square.classList.remove('hit'), 100);
            hitPosition = null;
        }
    });
});

function moveMole() {
    timerId = setInterval(randomSquare, 500);
}

function countDown() {
    gameTime--;
    timeLeftDisplay.textContent = gameTime;
    if (gameTime === 0) {
        clearInterval(timerId);
        clearInterval(countdownTimerId);
        backgroundMusic.pause();
        alert('Game Over! Your score is ' + score);
        saveScore(score);
        startButton.style.display = 'inline'; // Show start button when game ends
        scoreboard.style.display = 'block'; // Show scoreboard when game ends
        displayScores();
    }
}

startButton.addEventListener('click', () => {
    score = 0;
    gameTime = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = gameTime;
    startButton.style.display = 'none'; // Hide start button when game starts
    backgroundMusic.play(); // Play background music
    moveMole();
    countdownTimerId = setInterval(countDown, 1000);
});

volumeDownButton.addEventListener('click', () => {
    if (backgroundMusic.volume > 0) {
        backgroundMusic.volume -= 0.1;
    }
});

volumeUpButton.addEventListener('click', () => {
    if (backgroundMusic.volume < 1) {
        backgroundMusic.volume += 0.1;
    }
});

function getCurrentDate() {
    // const date = new Date();
    // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    var d = new Date();
    d = new Date(d.getTime() - 3000000);
    return d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
}

function saveScore(score) {
    const date = new Date();
    const scoreEntry = {
        no: lastScores.length + 1,
        date: getCurrentDate(),
        score: score
    };
    lastScores.push(scoreEntry);
    lastScores.sort((a, b) => b.score - a.score); // Sort scores in descending order
    if (lastScores.length > 10) {
        lastScores.pop(); // Keep only the top 10 scores
    }
    document.cookie = 'topScores=' + JSON.stringify(lastScores) + ';path=/';
}

function getScoresFromCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('topScores=')) {
            return JSON.parse(cookie.substring('topScores='.length));
        }
    }
    return [];
}

function displayScores() {
    scoreList.innerHTML = '';
    lastScores.forEach((scoreEntry, index) => {
        const li = document.createElement('tr');
        li.innerHTML = `<td>${index + 1}</td>
                        <td>${scoreEntry.date}</td>
                        <td>${scoreEntry.score}</td>`;
        scoreList.appendChild(li);
    });
}

// Initial display of scores
displayScores();
