<?php
session_start();

// Check if we have player data
if (!isset($_SESSION['playerData'])) {
    header('Location: index.php');
    exit;
}

$playerData = $_SESSION['playerData'];
$profitLoss = $playerData['currentBalance'] - $playerData['startingBalance'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Results - Plinko</title>
    <style>
      /* Reset and base layout */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    height: 100%;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(to right, #1f1c2c, #928dab);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* Container for results */
.container {
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 18px;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.05),
                0 0 40px rgba(255, 255, 255, 0.05);
    width: 90%;
    max-width: 450px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Title */
h1 {
    color: #21bb26;
    text-align: center;
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 25px;
    letter-spacing: 1.2px;
}

/* Card holding results */
.result-card {
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid #21bb26;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 30px;
    box-shadow: 0 0 10px rgba(33, 187, 38, 0.3);
}

/* Result item row */
.result-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 1.05rem;
}

.result-item:last-child {
    margin-bottom: 0;
}

/* Label and value */
.label {
    color: #ccc;
    font-weight: 500;
}

.value {
    font-weight: 600;
}

/* Colors for outcome */
.profit {
    color: #4ade80;
}

.loss {
    color: #f87171;
}

/* Button */
.btn {
    display: block;
    width: 100%;
    padding: 14px;
    font-size: 1.05rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    background: #21bb26;
    color: #000;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    text-transform: uppercase;
    box-shadow: 0 0 10px #21bb26;
    text-align: center;
    text-decoration: none;
    margin-top: 20px;
}

.btn:hover {
    background: linear-gradient(90deg, #2affca, #21bb26);
    transform: scale(1.02);
    box-shadow: 0 0 15px #21bb26;
}

/* Timestamp */
.timestamp {
    text-align: center;
    color: #bbb;
    font-size: 0.85rem;
    margin-top: 20px;
}

    </style>
</head>
<body>
    <div class="container">
        <h1>Game Results</h1>
        
        <div class="result-card">
            <div class="result-item">
                <span class="label">Player:</span>
                <span class="value"><?= htmlspecialchars($playerData['playerName']) ?></span>
            </div>
            <div class="result-item">
                <span class="label">Starting Balance:</span>
                <span class="value">$<?= number_format($playerData['startingBalance'], 2) ?></span>
            </div>
            <div class="result-item">
                <span class="label">Final Balance:</span>
                <span class="value">$<?= number_format($playerData['currentBalance'], 2) ?></span>
            </div>
            <div class="result-item">
                <span class="label">Profit/Loss:</span>
                <span class="value <?= $profitLoss >= 0 ? 'profit' : 'loss' ?>">
                    <?= ($profitLoss >= 0 ? '+' : '') . number_format($profitLoss, 2) ?>
                </span>
            </div>
            <!-- <div class="result-item">
                <span class="label">Last Bet:</span>
                <span class="value">$<?= number_format($playerData['currentBet'], 2) ?></span>
            </div>
            <div class="result-item">
                <span class="label">Last Win:</span>
                <span class="value">$<?= number_format($playerData['lastResult'], 2) ?></span>
            </div> -->
        </div>
        
        <div class="timestamp">
            Session ended on <?= date('M j, Y g:i A') ?>
        </div>
        
        <a href="index.php" class="btn">Play Again</a>
    </div>
</body>
</html>