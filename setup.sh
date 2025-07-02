#!/bin/bash

# Script de setup para VinotecaFinder Argentina
echo "🍷 Configurando VinotecaFinder Argentina..."

# Instalar dependencias de Python
echo "📦 Instalando dependencias de Python..."
pip install -r requirements.txt

# Instalar dependencias de Node.js (si es necesario)
echo "📦 Instalando dependencias de Node.js..."
npm install

# Crear directorio .streamlit si no existe
mkdir -p .streamlit

echo "✅ Setup completado!"
echo "🚀 Para ejecutar la aplicación:"
echo "   - Backend Node.js: npm start"
echo "   - Frontend Streamlit: streamlit run app.py" 