@echo off
echo ========================================================
echo ROYAL GOLD & DIAMONDS - GitHub Repository Push Script
echo Target: https://github.com/ksVishal123/ksv.git
echo ========================================================
echo.
git remote set-url origin https://github.com/ksVishal123/ksv.git
git branch -M main
git push -u origin main
echo.
echo If prompted, enter your GitHub credentials or Personal Access Token.
echo Once pushed, enable GitHub Pages at:
echo Settings -> Pages -> Deploy from branch (main, root).
echo Live link will be: https://ksvishal123.github.io/ksv/
pause
