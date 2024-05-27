const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let pipeWidth = 30;
let pipeGap = 100;
let frameCount = 0;
let score = 0;

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

function drawBird() {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }
}

function updatePipes() {
    frameCount++;

    if (frameCount % 90 === 0) {
        let top = Math.random() * (canvas.height / 2);
        let bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
    }
}

function checkCollision() {
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            resetGame();
        }
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    updateBird();
    updatePipes();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

gameLoop();
