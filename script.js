const gameBoard = document.getElementById('game-board');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('game-over');
        const restartButton = document.getElementById('restart-button');

        let snake = [{x: 10, y: 10}, {x: 9, y: 10}]; 
        let food = getRandomFood();
        let direction = 'right';
        let gameInterval;
        let score = 0;
        let foodEaten = 0;

        function getRandomFood() {
            return {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20)
            };
        }

        function drawGame() {
            gameBoard.innerHTML = '';
            drawSnake();
            drawFood();
        }

        function drawSnake() {
            snake.forEach((segment, index) => {
                const snakeElement = document.createElement('div');
                snakeElement.style.gridRowStart = segment.y + 1;
                snakeElement.style.gridColumnStart = segment.x + 1;
                snakeElement.classList.add('snake-segment');
                if (index === 0) {
                    snakeElement.classList.add('snake-head');
                }
                gameBoard.appendChild(snakeElement);
            });
        }

        function drawFood() {
            const foodElement = document.createElement('div');
            foodElement.style.gridRowStart = food.y + 1;
            foodElement.style.gridColumnStart = food.x + 1;
            foodElement.classList.add('food');
            gameBoard.appendChild(foodElement);
        }

        function moveSnake() {
            const head = {...snake[0]};
            switch(direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }

            // Allow snake to cross walls
            head.x = (head.x + 20) % 20;
            head.y = (head.y + 20) % 20;

            // Check if snake hits itself
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                foodEaten++;
                if (foodEaten === 2) {
                    foodEaten = 0;
                } else {
                    snake.pop();
                }
                food = getRandomFood();
                updateScore();
            } else {
                snake.pop();
            }
        }

        function updateScore() {
            scoreElement.textContent = `Score: ${score}`;
        }

        function gameOver() {
            clearInterval(gameInterval);
            gameOverElement.style.display = 'block';
        }

        function restartGame() {
            snake = [{x: 10, y: 10}, {x: 9, y: 10}]; 
            food = getRandomFood();
            direction = 'right';
            score = 0;
            foodEaten = 0;
            updateScore();
            gameOverElement.style.display = 'none';
            startGame();
        }

        function handleKeyPress(e) {
            switch(e.key) {
                case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
                case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
                case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
                case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
            }
        }

        let touchStartX = 0;
        let touchStartY = 0;

        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }

        function handleTouchMove(e) {
            if (!touchStartX || !touchStartY) {
                return;
            }

            let touchEndX = e.touches[0].clientX;
            let touchEndY = e.touches[0].clientY;

            let dx = touchEndX - touchStartX;
            let dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && direction !== 'left') {
                    direction = 'right';
                } else if (dx < 0 && direction !== 'right') {
                    direction = 'left';
                }
            } else {
                if (dy > 0 && direction !== 'up') {
                    direction = 'down';
                } else if (dy < 0 && direction !== 'down') {
                    direction = 'up';
                }
            }

            touchStartX = 0;
            touchStartY = 0;
            e.preventDefault();
        }

        function startGame() {
            gameInterval = setInterval(() => {
                moveSnake();
                drawGame();
            }, 200);
        }

        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        restartButton.addEventListener('click', restartGame);

        startGame();