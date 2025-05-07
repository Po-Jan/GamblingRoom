<?php
session_start();

// Initialize session variables if they don't exist
if (!isset($_SESSION['playerData'])) {
    $_SESSION['playerData'] = [
        'playerName' => 'Guest',
        'startingBalance' => 100,
        'currentBalance' => 100,
        'currentBet' => 0,
        'lastResult' => 0
    ];
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['start'])) {
    // Update player data in session
    $_SESSION['playerData']['playerName'] = htmlspecialchars($_POST['player'] ?? 'Guest');
    
    // Validate and set balance
    $balance = (int)($_POST['balance'] ?? 100);
    $balance = max(0, min($balance, 25000)); // Clamp between 0 and 25000
    
    $_SESSION['playerData']['startingBalance'] = $balance;
    $_SESSION['playerData']['currentBalance'] = $balance;
    
    header('Location: game.php');
    exit;
}

// Extract variables for form display
$playerName = $_SESSION['playerData']['playerName'];
$playerBalance = $_SESSION['playerData']['startingBalance'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plinko Simulator</title>
    <link rel="icon" type="image/x-icon" href="assets/plinko.png">
    <link rel="stylesheet" href="styles/main.css">
    <style>
        .error-msg {
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: none;
        }
        .input-number:invalid {
            border-color: #ff4444;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Welcome to Plinko!</h1>

        <form class="player-form" method="post" autocomplete="off">
            <div class="form-group">
                <label for="username">Player Name:</label>
                <input type="text" name="player" id="username" class="input-text" 
                       value="<?= htmlspecialchars($playerName) ?>" 
                       placeholder="Enter your name" maxlength="20" required>
            </div>

            <div class="form-group">
                <label for="initial-balance">Starting Balance ($):</label>
                <input type="number" name="balance" id="initial-balance" class="input-number" 
                       value="<?= $playerBalance ?>" min="0" max="25000" required>
                <span id="balance-warning" class="error-msg">Balance must be between $0 and $25,000.</span>
            </div>

            <input type="submit" name="start" class="btn-start" value="Enter the Game">
        </form>
    </div>

    <script>
        const balanceInput = document.getElementById("initial-balance");
        const warning = document.getElementById("balance-warning");

        balanceInput.addEventListener("input", function() {
            const maxBalance = 25000;
            const value = parseInt(this.value) || 0;
            
            if (value < 0) {
                this.value = 0;
                warning.style.display = "inline";
            } else if (value > maxBalance) {
                this.value = maxBalance;
                warning.style.display = "inline";
            } else {
                warning.style.display = "none";
            }
        });

        balanceInput.addEventListener("keydown", function(e) {
            if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        // Validate on form submit
        document.querySelector('.player-form').addEventListener('submit', function(e) {
            const balance = parseInt(balanceInput.value);
            if (isNaN(balance) || balance < 0 || balance > 25000) {
                e.preventDefault();
                balanceInput.focus();
                warning.style.display = "inline";
            }
        });
    </script>
</body>
</html>