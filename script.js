// Game Variables
let canvas, ctx;
let spaceshipX = 380, spaceshipY = 500;
let enemies = [];
let bullets = [];
let score = 0;
let enemyCreationInterval = 60; // Initial interval for enemy creation

// Track key states
let keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Initialize Game
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Create player's spaceship
    drawSpaceship();

    // Start Game Loop
    setInterval(gameLoop, 1000 / 40); // 60 FPS
};

// Draw Player's Spaceship
function drawSpaceship() {
    ctx.fillStyle = '#00ff00'; // Green color
    ctx.fillRect(spaceshipX, spaceshipY, 40, 40); // Spaceship size
}

// Create Enemy Spaceships
function createEnemy() {
    let enemyX = Math.random() * 720; // Random X position
    let enemyY = 0; // Start from top
    let enemyHP = Math.floor(Math.random() * 3) + 1; // Random HP between 1 and 3
    enemies.push({ x: enemyX, y: enemyY, alive: true, hp: enemyHP }); // Add hp property
}

// Draw Enemies
function drawEnemies() {
    for (let enemy of enemies) {
        if (enemy.alive) {
            // Set fill style based on HP
            if (enemy.hp === 3) {
                ctx.fillStyle = '#ff0000'; // Light Red for high HP
                ctx.fillRect(enemy.x, enemy.y, 30, 30); // Draw as rectangle
            } else if (enemy.hp === 2) {
                ctx.fillStyle = '#ffb74d'; // Light Orange for medium HP
                ctx.beginPath();
                ctx.arc(enemy.x + 15, enemy.y + 15, 15, 0, Math.PI * 2); // Draw as circle
                ctx.fill();
            } else {
                ctx.fillStyle = '#64b5f6'; // Light Blue for low HP
                ctx.beginPath();
                ctx.moveTo(enemy.x + 15, enemy.y);
                ctx.lineTo(enemy.x, enemy.y + 30);
                ctx.lineTo(enemy.x + 30, enemy.y + 30);
                ctx.closePath(); // Draw as triangle
                ctx.fill();
            }
        }
    }
}

// Draw Bullets
function drawBullets() {
    ctx.fillStyle = '#ffff00'; // Yellow color
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 5, 10); // Bullet size
    }
}

// Update Game Objects
// Update Game Objects
function update() {
    // Update enemy positions
    for (let enemy of enemies) {
        enemy.y += 2; // Move enemies downward
    }

    // Update bullet positions
    for (let bullet of bullets) {
        bullet.y -= 5; // Move bullets upward
    }

    // Check collision with player's spaceship
    for (let enemy of enemies) {
        if (
            enemy.x < spaceshipX + 40 &&
            enemy.x + 30 > spaceshipX &&
            enemy.y < spaceshipY + 40 &&
            enemy.y + 30 > spaceshipY
        ) {
            // Collision occurred with player's spaceship
            alert('Game Over! Your Score: ' + score);
            location.reload(); // Restart game
        }

        // Check collision with bullets
        for (let bullet of bullets) {
            if (
                bullet.x < enemy.x + 30 &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 30 &&
                bullet.y + 10 > enemy.y
            ) {
                // Bullet hit enemy
                enemy.hp--; // Decrease enemy HP
                bullets.splice(bullets.indexOf(bullet), 1); // Remove bullet
                if (enemy.hp <= 0) {
                    // Enemy destroyed
                    enemies.splice(enemies.indexOf(enemy), 1); // Remove enemy from array
                    score += 10; // Increase score
                }
            }
        }
    }

    // Remove enemies that go off-screen
    enemies = enemies.filter(enemy => enemy.y < 600);

    // Remove bullets that go off-screen
    bullets = bullets.filter(bullet => bullet.y > 0);

    // Increment score for each frame
    score += 1;

    // Create new enemy at adjusted intervals based on score
    if (score % enemyCreationInterval === 0) {
        createEnemy();
        if (enemyCreationInterval > 30) { // Limit the minimum interval
            enemyCreationInterval -= 1; // Decrease interval as score increases
        }
    }

}


// Game Loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player's spaceship
    drawSpaceship();

    // Draw enemies
    drawEnemies();

    // Draw bullets
    drawBullets();

    // Update game objects
    update();

    // Display score
    ctx.fillStyle = '#fff'; // White color
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Control Player's Spaceship and Shooting
setInterval(() => {
    if (keys['ArrowLeft'] && spaceshipX > 0) spaceshipX -= 15;
    if (keys['ArrowRight'] && spaceshipX < 760) spaceshipX += 15;
    if (keys[' ']) bullets.push({ x: spaceshipX + 18, y: spaceshipY - 10 }); // Shoot bullet
}, 50);