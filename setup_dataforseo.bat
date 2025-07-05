@echo off
echo 🍷 Configuración de DataForSEO para VinotecaFinder
echo.

REM Verificar si existe .env
if exist ".env" (
    echo ⚠️  El archivo .env ya existe
    set /p overwrite="¿Deseas sobrescribirlo? (s/n): "
    if /i not "%overwrite%"=="s" (
        echo ❌ Configuración cancelada
        pause
        exit /b 0
    )
)

echo.
echo 📋 Para usar datos reales de vinotecas, necesitas credenciales de DataForSEO
echo 🌐 Obtén tus credenciales gratuitas en: https://dataforseo.com/
echo.

set /p login="Ingresa tu DATAFORSEO_LOGIN: "
set /p password="Ingresa tu DATAFORSEO_PASSWORD: "

if "%login%"=="" (
    echo ❌ Error: DATAFORSEO_LOGIN no puede estar vacío
    pause
    exit /b 1
)

if "%password%"=="" (
    echo ❌ Error: DATAFORSEO_PASSWORD no puede estar vacío
    pause
    exit /b 1
)

echo.
echo 📝 Creando archivo .env...

(
echo # DataForSEO API Credentials
echo DATAFORSEO_LOGIN=%login%
echo DATAFORSEO_PASSWORD=%password%
echo.
echo # Puerto del servidor ^(opcional, por defecto 3000^)
echo PORT=3000
echo.
echo # Entorno ^(development/production^)
echo NODE_ENV=development
) > .env

echo ✅ Archivo .env creado exitosamente
echo.
echo 🚀 Ahora puedes iniciar el servidor con datos reales:
echo    npm start
echo.
echo 📱 La aplicación estará disponible en: http://localhost:3000
echo.

pause 