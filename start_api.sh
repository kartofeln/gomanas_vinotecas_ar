#!/bin/bash

echo "🍷 Iniciando VinotecaFinder API..."
echo

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor, instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
fi

# Iniciar el servidor
echo "🚀 Iniciando servidor en http://localhost:3000"
echo "📱 Abre tu navegador en: http://localhost:3000"
echo
echo "Presiona Ctrl+C para detener el servidor"
echo

npm start 