@echo off
echo ========================================================
echo ROYAL GOLD & DIAMONDS - GitHub Repository Push Script
echo Target: https://github.com/ksVishal123/royal-gold-and-diamonds.git
echo ========================================================
echo.
echo Please ensure you have created an empty repository named:
echo "royal-gold-and-diamonds" on GitHub under your account ksVishal123.
echo (https://github.com/new)
echo.
pause
git branch -M main
git push -u origin main
echo.
echo If prompted, enter your GitHub Personal Access Token (PAT) as password.
echo Once pushed, enable GitHub Pages at:
echo Settings -> Pages -> Deploy from branch (main, root).
echo Live link will be: https://ksvishal123.github.io/royal-gold-and-diamonds/
pause
