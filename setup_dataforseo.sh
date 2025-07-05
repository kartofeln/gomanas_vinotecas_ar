#!/bin/bash

echo "🍷 Configuración de DataForSEO para VinotecaFinder"
echo

# Verificar si existe .env
if [ -f ".env" ]; then
    echo "⚠️  El archivo .env ya existe"
    read -p "¿Deseas sobrescribirlo? (s/n): " overwrite
    if [[ ! $overwrite =~ ^[Ss]$ ]]; then
        echo "❌ Configuración cancelada"
        exit 0
    fi
fi

echo
echo "📋 Para usar datos reales de vinotecas, necesitas credenciales de DataForSEO"
echo "🌐 Obtén tus credenciales gratuitas en: https://dataforseo.com/"
echo

read -p "Ingresa tu DATAFORSEO_LOGIN: " login
read -s -p "Ingresa tu DATAFORSEO_PASSWORD: " password
echo

if [ -z "$login" ]; then
    echo "❌ Error: DATAFORSEO_LOGIN no puede estar vacío"
    exit 1
fi

if [ -z "$password" ]; then
    echo "❌ Error: DATAFORSEO_PASSWORD no puede estar vacío"
    exit 1
fi

echo
echo "📝 Creando archivo .env..."

cat > .env << EOF
# DataForSEO API Credentials
DATAFORSEO_LOGIN=$login
DATAFORSEO_PASSWORD=$password

# Puerto del servidor (opcional, por defecto 3000)
PORT=3000

# Entorno (development/production)
NODE_ENV=development
EOF

echo "✅ Archivo .env creado exitosamente"
echo
echo "🚀 Ahora puedes iniciar el servidor con datos reales:"
echo "   npm start"
echo
echo "📱 La aplicación estará disponible en: http://localhost:3000"
echo 