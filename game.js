const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PADDLE_SPEED = 6;
const AI_SPEED = 5;
const BALL_SPEED = 6;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#0ff';
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player paddle (left)
    ctx.fillStyle = '#ff0';
    ctx.fillRect(canvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI paddle (right)

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 40);
}

function update() {
    // Ball movement
    ballX += ballVX;
    ballY += ballVY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVY = -ballVY;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Ball collision with player paddle
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballVX = Math.abs(ballVX);
        // Add spin based on hit position
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballVY += hitPos * 0.15;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballVX = -Math.abs(ballVX);
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballVY += hitPos * 0.15;
    }

    // Ball out of bounds (score)
    if (ballX < -BALL_SIZE) {
        aiScore++;
        resetBall(-1);
    } else if (ballX > canvas.width + BALL_SIZE) {
        playerScore++;
        resetBall(1);
    }

    // AI paddle movement (simple follow ball)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall(dir) {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * dir;
    ballVY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();