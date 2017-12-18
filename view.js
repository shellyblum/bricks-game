

window.onload = function init() {

    //h1:
    var h1 = document.createElement('h1');
    h1.innerHTML = 'Breakout Game!';
    document.body.appendChild(h1);
    //start button:
    var startButton = document.createElement('button');
    startButton.setAttribute('id', 'start');
    startButton.innerHTML = 'Start Game!';
    document.body.appendChild(startButton);
    var canvas = document.getElementById('game');
    document.body.appendChild(canvas);
    // document.body.insertBefore(h1,canvas);
    document.body.insertBefore(canvas, startButton);
    if (!canvas.getContext) { return false; }

    var ctx = canvas.getContext('2d');
    if (!ctx) { return false; }

    canvas.setAttribute('width', 600);
    canvas.setAttribute('height', 400);
    var paddleWidth = 90;
    var paddleHeight = 15;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var ballRadius = 10;
    var dx = 4;
    var dy = -4;
    var rightPressed = false;
    var leftPressed = false;
    var score = 0;
    var lives = 3;
    var playing = false;

    //bricks:
    var brickRowCount = 3;
    var brickColumnCount = 4;
    var brickWidth = 120;
    var brickHeight = 50;
    var brickPadding = 10;
    var brickOffsetTop = 40;
    var brickOffsetLeft = 45;

    var bricks = [];
    for (var c = 0; c < brickColumnCount; ++c) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; ++r) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    startButton.addEventListener("click", startGameClick);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }
    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
        if (e.keyCode == 13) {
            enterPressed = true;
        }
        else if (e.keyCode == 32) {
            spacePressed = true;
        }
    }
    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
        if (e.keyCode == 13) {
            enterPressed = false;
        }
        else if (e.keyCode == 32) {
            spacePressed = false;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; ++c) {
            for (var r = 0; r < brickRowCount; ++r) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        ++score;
                    } if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, (canvas.height - (paddleHeight + 5)), paddleWidth, paddleHeight);
            ctx.fillStyle = "maroon";
            ctx.fill();
            ctx.closePath();
            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            }
            else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }
        }
        /**
         * Draws the ball in each current position
         */
        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
            if (x + dx > canvas.width || x + dx < 0) {
                dx = -dx;
            }
            if (y + dy < ballRadius) {
                dy = -dy;
                //ball falls down
            } else if (y + dy >= canvas.height - ballRadius) {
                if (x > paddleX && (x < paddleX + paddleWidth || x == paddleX || x == paddleX + paddleWidth)) {
                    dy = -dy;
                } else {
                    lives--;
                    if (!lives) {
                        alert("GAME OVER");
                        document.location.reload();
                    }
                    else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 4;
                        dy = -4;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }
            x += dx;
            y += dy;
            var animate = requestAnimationFrame(draw);
        }
        /**
         * Draws the bricks
         */
        function drawBricks() {
            for (var c = 0; c < brickColumnCount; ++c) {
                for (var r = 0; r < brickRowCount; ++r) {
                    var b = bricks[c][r];
                    if (b.status == 1) {
                        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                        b.x = brickX;
                        b.y = brickY;
                        var img = new Image();
                        img.src = 'http://reclaimedbricks-york.co.uk/wp-content/uploads/2015/02/Brick-Slips.fw_.png';
                        var pattern = ctx.createPattern(img, 'repeat');
                        ctx.fillStyle = pattern;
                        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);

                    }
                }
            }
            //for simple color filled bricks:
            // for (var c = 0; c < brickColumnCount; ++c) {
            //     for (var r = 0; r < brickRowCount; ++r) {
            //         if (bricks[c][r].status == 1) {
            //             var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            //             var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            //             bricks[c][r].x = brickX;
            //             bricks[c][r].y = brickY;
            //             ctx.beginPath();
            //             ctx.rect(brickX, brickY, brickWidth, brickHeight);
            //             ctx.fillStyle = "maroon";
            //             ctx.fill();
            //             ctx.closePath();
            //         }
            //     }
            // }
        }
        function drawScore() {
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Score: " + score, 25, 30);
        }
        function drawLives() {
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "bold";
            ctx.fillText("Lives: " + lives, canvas.width - 85, 30);
        }
        return {
            drawPaddle: drawPaddle(),
            drawBall: drawBall(),
            drawBricks: drawBricks(),
            drawScore: drawScore(),
            drawLives: drawLives(),
            collisionDetection: collisionDetection()
        }
    })();

}

function startGameClick(e) {

    if(e) {
        init();
    }
    
    // if(!e) {
    //     dx = 0;
    //     dy = 0;
    //     cancelAnimationFrame(animate);
    //     window.stop();
    //     object.freeze(window);
    // } else {
    //     draw();
    // }
}