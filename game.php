<?php
session_start();

if (!isset($_SESSION['playerData'])) {
    header('Location: index.php');
    exit;
}

$playerName = $_SESSION['playerData']['playerName'];
$playerBalance = $_SESSION['playerData']['currentBalance'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plinko Game</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="styles/game.css">
    <link rel="icon" href="assets/plinko.png" type="image/x-icon">
</head>
<body>
    <div class="header"></div>
<div class="body">
    <div class="leftContainterFull">
        <div class="nameDiv">
                <span>User: <?= htmlspecialchars($playerName) ?></span>
        </div>
        <div class="containerData">
            <label id="riskSelectLabel" for="riskSelect">Risk:</label>
            <select id="riskSelect">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high" selected>High</option>
            </select>

            <label id="rowsSelectLabel" for="rowsSelect">Rows:</label>
            <select id="rowsSelect">
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16" selected>16</option>
            </select>

            <label id="inputLabel" for="inputAmount">Amount:</label>
            <input id="inputAmount" type="number" placeholder="Enter amount">
            <span class="error-msg" style="display: none;"></span>

            <button id="dropBallBtn">Play</button>
            <button id="cashOutBtn" class="cash-out-btn" type="submit">Cash Out</button>
        </div>
    </div>
    <div class="rightContainerFull">
        <div class="balanceDiv">
                <span>Balance: $<?= number_format($playerBalance, 2) ?></span>
        </div>
        <div class="containerGame">
            <canvas id="gameCanvas" width="700" height="700"></canvas>
        </div>
    </div>
</div>

    <script>
        const playerName = "<?= htmlspecialchars($playerName) ?>";
        let playerBalance = <?= (float)$playerBalance ?>;
        
        // Update balance display initially
        document.querySelector('.balanceDiv span').textContent = `Balance: $${playerBalance.toFixed(2)}`;
    </script>

    <script src="js/game.js"></script>
    <script src="js/data.js"></script>
</body>
</html>