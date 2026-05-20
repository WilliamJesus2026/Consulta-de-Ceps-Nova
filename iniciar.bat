@echo off
REM ==========================================================
REM  Launcher do Site de CEPs
REM  Inicia um servidor HTTP local e abre o navegador.
REM ==========================================================
title Site de CEPs - Servidor Local
cd /d "%~dp0"

echo.
echo ==========================================
echo   Site de CEPs - Iniciando servidor local
echo ==========================================
echo.
echo Porta: 8000
echo Pasta: %cd%
echo.
echo Aguarde alguns segundos enquanto o navegador abre...
echo Para encerrar, feche esta janela.
echo.

REM Tenta abrir o navegador apos 2 segundos
start "" /B cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"

REM Tenta Python 3 primeiro
where python >nul 2>nul
if %ERRORLEVEL% == 0 (
    python -m http.server 8000
    goto :eof
)

where py >nul 2>nul
if %ERRORLEVEL% == 0 (
    py -3 -m http.server 8000
    goto :eof
)

echo.
echo [ERRO] Python nao encontrado no PATH.
echo.
echo Instale o Python 3 em: https://www.python.org/downloads/
echo Ou execute manualmente: python -m http.server 8000
echo.
pause
