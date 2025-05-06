# 🎰 Plinko Gambling Demo Game

Welcome to the **Plinko Gambling Demo Game** — a browser-based PHP and JavaScript project that simulates a simple gambling experience inspired by the classic Plinko game!

## 🕹 Features

- 🎮 Interactive Plinko board rendered with JavaScript Canvas
- 🔐 User session tracking with login form (PHP-based)
- 💰 Risk level options: Low, Medium, High
- 📈 Multipliers based on selected risk and number of rows (10, 12, 14, 16)
- 🧠 Backend logic built in PHP, frontend in HTML/CSS/JS

## 🧱 How It Works

1. **Login or Register**  
   Start by logging in. Sessions track user activity during gameplay.

2. **Choose Your Risk & Rows**  
   Select your risk level and number of rows. Risk level affects the payout multipliers.

3. **Drop the Ball**  
   The ball will bounce through a triangular grid of pegs and land in one of the multiplier bins.

4. **Win or Lose**  
   Your payout is based on the final bin's multiplier.

## 🚀 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Canvas API)
- **Backend:** PHP (session handling, login logic)
- **Data:** Hardcoded multiplier tables per risk level and row count

