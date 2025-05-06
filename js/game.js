

const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d'); // createCircle, createRectangle, createTriangle, createLine

    const DECIMAL_MULTIPLIER = 10000;

    const WIDTH = 700;
    const HEIGHT = 800;
    const ballRadius = 7;
    const obstacleRadius = 4;
    const gravity = pad(0.1);
    const horizontalFriction = 0.4;
    const verticalFriction = 0.8;
    let balls = [];

    let currentBet = 0;
    let isRoundInProgress = false;
    let ballsInPlay = 0;
    let lastBetAmount = 0;

    var numberOffsetY=240;
    var numberOffsetX=0;
    var rows = 16;
    var riskLevel="high";
    calculateOffsets(rows);

    function calculateOffsets(rows) {
    
      // Define the cases for different row counts
      switch (rows) {
        case 16:
          numberOffsetY = 240;
          numberOffsetX = 5;
          break;
        case 14:
          numberOffsetY = 310;
          numberOffsetX = 40;
          break;
        case 12:
          numberOffsetY = 380;
          numberOffsetX = 75;
          break;
        case 10:
          numberOffsetY = 450;
          numberOffsetX = 113;
          break;
          default:
          numberOffsetY = 520;
          numberOffsetX = 148;
          break;
      }
    
      return { numberOffsetY, numberOffsetX };
    }

    const lowRiskMultipliers = {
      9: [5.6, 2, 1.6, 1, 0.7, 1, 1.6, 2, 5.5],
      11: [8.4, 3, 1.9, 1.3, 1, 0.7, 1, 1.3, 1.9, 3, 8.4],
      13: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
      15: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15]
    };

    const mediumRiskMultipliers = {
      9: [18, 4, 1.7,0.9, 0.5, 0.9, 1.7, 4, 18],
      11: [24, 6, 3, 1.8, 0.7, 0.5, 0.7, 1.8, 3, 6, 24],
      13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 6, 13, 43],
      16: [88, 41, 11, 5, 3, 1.3,0.5, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88]
    };

    const highRiskMultipliers = {
      9: [43, 7, 2, 0.6, 0.2, 0.6, 2, 7, 43],
      11: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.4, 1.4, 5.2, 14,120],
      13: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
      15: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620]
    };

    
    function updateGameSettings() {
      // Recreate obstacles and sinks
      obstacles.length = 0;
      sinks.length = 0;
      
      createObstacles();
      const sinkWidth = 36;
      sinks.push(...createSinks(rows, numberOffsetY, numberOffsetX, sinkWidth, obstacleRadius));
      
      // Update multipliers based on current settings
      assignMultipliersToSinks(rows, riskLevel);
      
      // Reset balls
      balls = [];
      
      // Redraw
      update();
    }
    
    document.getElementById('rowsSelect').addEventListener('change', function() {
      rows = parseInt(this.value);
      calculateOffsets(rows);
      updateGameSettings(); // Single call to handle everything
    });
    
    document.getElementById('riskSelect').addEventListener('change', function(e) {
      riskLevel = e.target.value;
      updateGameSettings(); // Single call to handle everything
    });
    

    const obstacles = [];
    const sinks = [];

    function pad(n) {
      return n * DECIMAL_MULTIPLIER;
    }

    function unpad(n) {
      return Math.floor(n / DECIMAL_MULTIPLIER);
    }


    function createObstacles() {
      const spacing = 36;
      for (let row = 2; row < rows; row++) {
        const numObstacles = row + 1;
        const y = 0 + row * 35;
        for (let col = 0; col < numObstacles; col++) {
          const x = WIDTH / 2 - spacing * (row / 2 - col); // no numberOffsetX here
          obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius });
        }
      }
    }
    

    
  function createSinks(rows, numberOffsetY, numberOffsetX, sinkWidth, obstacleRadius) {
    const sinks = [];
    const NUM_SINKS = rows - 1;

    for (let i = 0; i < NUM_SINKS; i++) {
      const x = WIDTH / 2 + (i - 7.5) * sinkWidth + obstacleRadius + numberOffsetX;
      const y = HEIGHT - numberOffsetY;
      const width = sinkWidth;
      const height = width;
      sinks.push({ x, y, width, height });
    }

    return sinks;
  }



  class Ball {
    constructor(x, y, radius, color, betAmount) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.betAmount = betAmount || 0;
        this.landed = false;
        this.vx = 0;
        this.vy = 0;
        
        // Random initial velocity
        const initialDirection = Math.random() > 0.5 ? 1 : -1;
        this.vx = initialDirection * (0.3 + Math.random() * 0.3);
        this.vy = -0.3 + Math.random() * 0.3;
        
        // Slight starting position variation
        const startOffset = (Math.random() - 0.5) * 10;
        this.x += pad(startOffset);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.landed) return;

        // Apply physics
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        const rightBoundary = sinks[sinks.length-1].x + sinks[sinks.length-1].width/2;
        const leftBoundary = sinks[0].x - sinks[0].width/2;
        
        if (unpad(this.x) + this.radius > rightBoundary) {
            this.x = pad(rightBoundary - this.radius);
            this.vx *= -0.6;
        }
        
        if (unpad(this.x) - this.radius < leftBoundary) {
            this.x = pad(leftBoundary + this.radius);
            this.vx *= -0.6;
        }

        // Obstacle collisions
        obstacles.forEach(obstacle => {
            const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
            if (dist < pad(this.radius + obstacle.radius)) {
                const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                
                this.vx = Math.cos(angle) * speed * horizontalFriction * 0.7;
                this.vy = Math.sin(angle) * speed * verticalFriction * 0.7;

                const overlap = this.radius + obstacle.radius - unpad(dist);
                this.x += pad(Math.cos(angle) * overlap);
                this.y += pad(Math.sin(angle) * overlap);
            }
        });

        // Sink collisions
        sinks.forEach(sink => {
            if (this.shouldLandInSink(sink)) {
                this.land(sink);
            }
        });
    }

    shouldLandInSink(sink) {
        return (
            !this.landed &&
            unpad(this.x) > sink.x - sink.width / 2 &&
            unpad(this.x) < sink.x + sink.width / 2 &&
            unpad(this.y) + this.radius > sink.y - sink.height / 2
        );
    }

    land(sink) {
      this.landed = true;
      ballsInPlay--;
      
      if (sink.multiplier !== undefined) {
          const winnings = this.betAmount * sink.multiplier;
          playerBalance += winnings;
          updateBalanceDisplay();
          
      }
  }
}


// Add this to your existing code where you create sinks:
function createSinks(rows, numberOffsetY, numberOffsetX, sinkWidth, obstacleRadius) {
  const sinks = [];
  const NUM_SINKS = rows - 1;

  for (let i = 0; i < NUM_SINKS; i++) {
      const x = WIDTH / 2 + (i - 7.5) * sinkWidth + obstacleRadius + numberOffsetX;
      const y = HEIGHT - numberOffsetY;
      const width = sinkWidth;
      const height = width;
      sinks.push({ 
          x, 
          y, 
          width, 
          height,
          multiplier: 0 // Will be set by assignMultipliersToSinks
      });
  }

  return sinks;
}
// 3. Fix updateBalanceDisplay function
function updateBalanceDisplay() {
  const balanceElement = document.querySelector('.balanceDiv span');
  if (balanceElement) {
    balanceElement.textContent = `Balance: $${playerBalance.toFixed(2)}`;
  }
  
  // Update to use your update_session.php file
  fetch('update_session.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `balance=${playerBalance}`
  }).catch(error => {
    console.error('Error updating session:', error);
  });
}
function removeLandedBalls() {
  // Filter out balls that have landed
  balls = balls.filter(ball => !ball.landed);
}

    // const initialBall = new Ball(pad(WIDTH / 2 + 23), pad(50), ballRadius, 'red');
    // balls.push(initialBall);

    function drawObstacles() {
      ctx.fillStyle = 'white';
      obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    }

    function drawSinks() {
      const spacing = 8; // gap between sinks
      const xOffset = 10; // shift everything 10px to the right
  
      if (sinks.length === 0) return;
  
      // Get leftmost and rightmost X positions for gradient
      const firstSink = sinks[0];
      const lastSink = sinks[sinks.length - 1];
      const gradStartX = firstSink.x;
      const gradEndX = lastSink.x + lastSink.width;
  
      const gradient = ctx.createLinearGradient(gradStartX, 0, gradEndX, 0);
  
      if (sinks.length <= 6) {
          gradient.addColorStop(0.0, 'red');
          gradient.addColorStop(0.5, 'yellow');
          gradient.addColorStop(1.0, 'red');
      } else {
          gradient.addColorStop(0.0, 'red');
          gradient.addColorStop(0.25, 'orange');
          gradient.addColorStop(0.5, 'yellow');
          gradient.addColorStop(0.75, 'orange');
          gradient.addColorStop(1.0, 'red');
      }
  
      // Set text styling
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
  
      for (let i = 0; i < sinks.length; i++) {
          const sink = sinks[i];
          const x = sink.x - sink.width / 2 + spacing / 2 + xOffset;
          const y = sink.y - sink.height / 2;
          const size = sink.width - spacing;
  
          // Draw sink with gradient
          ctx.fillStyle = gradient;
          const radius = 8;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + size - radius, y);
          ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
          ctx.lineTo(x + size, y + size - radius);
          ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
          ctx.lineTo(x + radius, y + size);
          ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
  
          // Draw multiplier text with conditional formatting
          if (sink.multiplier !== undefined) {
              ctx.fillStyle = '#000'; // Black text
              
              // Format multiplier based on its value
              let displayText;
              let fontSize = '10px';
              if (sink.multiplier >= 10) {
                  // For 2-digit numbers, show just the integer without "x"
                  displayText = Math.floor(sink.multiplier).toString();
                  fontSize = '9px'; // Slightly smaller font for larger numbers
              } else {
                  // For single-digit numbers, show with one decimal and "x"
                  displayText = sink.multiplier.toFixed(1) + "x";
              }
              
              // Apply font size
              ctx.font = `bold ${fontSize} Arial`;
              
              ctx.fillText(
                  displayText,
                  sink.x + xOffset,
                  sink.y
              );
          }
      }
  }

  function cashOut() {
    // Create form data
    const formData = new FormData();
    formData.append('playerName', "<?php echo $_SESSION['playerName'] ?? 'Player'; ?>");
    formData.append('balance', playerBalance);
    formData.append('currentBet', currentBet);
    formData.append('lastResult', playerBalance);
    formData.append('action', 'cashout');

    // Submit to update_session.php first
    fetch('update_session.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Then redirect to end.php
            window.location.href = 'end.php';
        }
    })
    .catch(error => {
        console.error('Cash out error:', error);
    });
}
  


  // Cash Out Functionality
  document.getElementById('cashOutBtn').addEventListener('click', function() {
    cashOut();
  });

    function assignMultipliersToSinks(rowCount, risk) {
      let multipliers;
      
      // Get the right multiplier array based on risk level
      if (risk === "low") {
        multipliers = lowRiskMultipliers[rowCount];
      } else if (risk === "medium") {
        multipliers = mediumRiskMultipliers[rowCount];
      } else { // default to high
        multipliers = highRiskMultipliers[rowCount];
      }
    
      // Safety check - if no exact match, find closest row count
      if (!multipliers) {
        const availableRows = Object.keys(risk === "low" ? lowRiskMultipliers : 
                                       risk === "medium" ? mediumRiskMultipliers : 
                                       highRiskMultipliers).map(Number);
        const closestRow = availableRows.reduce((prev, curr) => 
          Math.abs(curr - rowCount) < Math.abs(prev - rowCount) ? curr : prev);
        
        console.warn(`Using ${closestRow} row multipliers for ${rowCount} rows`);
        multipliers = risk === "low" ? lowRiskMultipliers[closestRow] :
                     risk === "medium" ? mediumRiskMultipliers[closestRow] :
                     highRiskMultipliers[closestRow];
      }
    
      // Ensure we have multipliers to work with
      if (!multipliers || multipliers.length === 0) {
        console.error("No multipliers available, using fallback");
        multipliers = Array(sinks.length).fill(1);
      }
    
      // Sort sinks by x-position (left to right)
      sinks.sort((a, b) => a.x - b.x);
    
      // Distribute multipliers according to natural distribution
      if (multipliers.length === sinks.length) {
        // Perfect match - assign directly
        for (let i = 0; i < sinks.length; i++) {
          sinks[i].multiplier = multipliers[i];
        }
      } else {
        // Need to distribute multipliers across sinks
        const centerIndex = Math.floor(sinks.length / 2);
        const multiplierCenterIndex = Math.floor(multipliers.length / 2);
        
        for (let i = 0; i < sinks.length; i++) {
          // Calculate position relative to center (0 = center, 1 = one step out)
          const relativePos = Math.abs(i - centerIndex) / centerIndex;
          // Find closest multiplier index
          const multiplierIndex = Math.round(relativePos * (multipliers.length - 1));
          // Ensure we don't go out of bounds
          const safeIndex = Math.min(multiplierIndex, multipliers.length - 1);
          sinks[i].multiplier = multipliers[safeIndex];
        }
      }
    
      // Verify distribution
      console.log("Multipliers distribution:", sinks.map(s => s.multiplier));
    }
    
    

    // Modified addBall function for continuous play
function addBall() {
  const amountInput = document.getElementById('inputAmount');
  
  // Use last bet amount if input is empty
  let betAmount = parseFloat(amountInput.value);
  if (isNaN(betAmount)) {
      if (lastBetAmount > 0) {
          betAmount = lastBetAmount;
          amountInput.value = betAmount; // Show the amount being used
      } else {
          showError(amountInput, 'Please enter a bet amount!');
          return;
      }
  }
  
  // Validation
  if (betAmount <= 0) {
      showError(amountInput, 'Bet must be positive!');
      return;
  }
  
  if (betAmount > playerBalance) {
      showError(amountInput, 'Insufficient balance!');
      return;
  }

  // Store the last valid bet amount
  lastBetAmount = betAmount;
  
  // Deduct bet amount
  currentBet += betAmount;
  playerBalance -= betAmount;
  updateBalanceDisplay();
  
  // Create new ball
  const newBall = new Ball(
      pad(WIDTH / 2 + 13),
      pad(50),
      ballRadius,
      'red',
      betAmount
  );
  balls.push(newBall);
  ballsInPlay++;
  

  document.getElementById('dropBallBtn').disabled = false; // Keep enabled for continuous play
  document.getElementById('cashOutBtn').disabled = false;
      
      // Clear input but remember value
      amountInput.dataset.lastValue = amountInput.value;
      amountInput.value = '';
  }
  


  function updateServerBalance() {
    fetch('update_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ balance: playerBalance })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Failed to update server balance');
        }
    })
    .catch(error => {
        console.error('Error updating balance:', error);
    });
}

function showError(input, message) {
    input.style.border = '2px solid red';
    const errorMsg = input.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('error-msg')) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
    setTimeout(() => {
        input.style.border = '';
        if (errorMsg) errorMsg.style.display = 'none';
    }, 2000);
}

// Helper function for error display
function showError(input, message) {
  input.style.border = '2px solid red';
  input.placeholder = message;
  setTimeout(() => {
    input.style.border = '';
    input.placeholder = 'Enter bet amount';
  }, 2000);
}



// Event listener for input field to update lastBetAmount
document.getElementById('inputAmount').addEventListener('input', function() {
    const betAmount = parseFloat(this.value);
    if (!isNaN(betAmount)) {
        lastBetAmount = betAmount;
    }
});


// Event listeners
document.getElementById('dropBallBtn').addEventListener('click', addBall);

    function draw() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      drawObstacles();
      drawSinks();
      balls.forEach(ball => {
        ball.draw();
        ball.update();
      });
    }

    function update() {
      // Remove landed balls first
      removeLandedBalls();
      
      // Update and draw remaining balls
      balls.forEach(ball => ball.update());
      draw();
      
      requestAnimationFrame(update);
    }

    function initGame() {
      obstacles.length = 0;
      sinks.length = 0;
      balls.length = 0;
      
      createObstacles();
      const sinkWidth = 36;
      sinks.push(...createSinks(rows, numberOffsetY, numberOffsetX, sinkWidth, obstacleRadius));
      assignMultipliersToSinks(rows, riskLevel);
      
      updateBalanceDisplay(); // Initialize balance display
      update();
    }
    initGame();