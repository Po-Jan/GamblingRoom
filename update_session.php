<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // For regular balance updates
    if (isset($_POST['balance'])) {
        $_SESSION['balance'] = floatval($_POST['balance']);
    }
    
    // For cash out requests
    if (isset($_POST['action']) && $_POST['action'] === 'cashout') {
        $_SESSION['cashout_data'] = [
            'playerName' => $_POST['playerName'],
            'finalBalance' => $_POST['balance'],
            'currentBet' => $_POST['currentBet'],
            'lastResult' => $_POST['lastResult'],
            'cashoutTime' => date('Y-m-d H:i:s')
        ];
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
}
?>