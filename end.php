<?php
session_start();

// Handle POST data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate input
    $_SESSION["playerName"] = htmlspecialchars($_POST["playerName"] ?? 'Guest');
    $_SESSION["balance"] = floatval($_POST["balance"] ?? 0);
    $_SESSION["currentBet"] = floatval($_POST["currentBet"] ?? 0);
    $_SESSION["lastResult"] = floatval($_POST["lastResult"] ?? 0);
    $_SESSION["cashOutTime"] = date('Y-m-d H:i:s');

    // Return JSON response for AJAX requests
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'session' => $_SESSION
        ]);
        exit;
    }
    
    // If not AJAX, continue to render HTML
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Results - Plinko</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .session-data {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;

        }
        .btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Game Results</h1>
        
        <?php if (!empty($_SESSION)) : ?>
            <div class="session-data">
                <h2>Session Data</h2>
                <pre><?php 
                    $displaySession = $_SESSION;
                    unset($displaySession['previous_balance']); // Remove sensitive data if needed
                    print_r($displaySession); 
                ?></pre>
            </div>
            
            
        <?php else : ?>
            <p>No game data available. Please play the game first.</p>
        <?php endif; ?>
        
        <a href="index.php" class="btn">Play Again</a>
    </div>
</body>
</html>