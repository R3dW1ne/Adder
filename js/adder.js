const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('math-question');
const answerButtons = document.querySelectorAll('.answer-btn');

let snake = [{x: canvas.width / 2, y: canvas.height / 2}];
let dx = 10;
let dy = 0;
let score = 0;
let currentQuestion = {};
let interval;

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
        clearInterval(interval);
        alert("Game Over!");
        return;
    }

    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (keyPressed === LEFT_KEY && dx === 0) {
        dx = -10;
        dy = 0;
    } else if (keyPressed === UP_KEY && dy === 0) {
        dx = 0;
        dy = -10;
    } else if (keyPressed === RIGHT_KEY && dx === 0) {
        dx = 10;
        dy = 0;
    } else if (keyPressed === DOWN_KEY && dy === 0) {
        dx = 0;
        dy = 10;
    }
}

function generateQuestion() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const correctAnswer = a + b;

    currentQuestion = { a, b, correctAnswer };
    questionElement.textContent = `${a} + ${b} = ?`;

    const answers = [correctAnswer];
    while (answers.length < 4) {
        const answer = Math.floor(Math.random() * 20);
        if (!answers.includes(answer)) {
            answers.push(answer);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    answerButtons.forEach((button, index) => {
        button.textContent = answers[index];
        button.onclick = checkAnswer;
    });
}

function checkAnswer(event) {
    const answer = parseInt(event.target.textContent);
    if (answer === currentQuestion.correctAnswer) {
        score += 10;
        scoreElement.textContent = `Punkte: ${score}`;
        snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y});
    }
    generateQuestion();
}

function gameLoop() {
    clearCanvas();
    moveSnake();
    drawSnake();
    if (checkCollision()) {
        clearInterval(interval);
        alert("Game Over!");
    }
}

function checkCollision() {
    const head = snake[0];
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= canvas.width;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

document.addEventListener('keydown', changeDirection);
generateQuestion();
interval = setInterval(gameLoop, 100);
