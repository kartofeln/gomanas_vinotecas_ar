#!/bin/bash

# Script para forzar redeploy en Streamlit Cloud
echo "🚀 Forzando redeploy en Streamlit Cloud..."

# Verificar que estamos en el directorio correcto
if [ ! -f "app.py" ]; then
    echo "❌ Error: No se encontró app.py. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# Verificar que packages.txt esté correcto
if grep -q "^#" packages.txt; then
    echo "⚠️  Advertencia: packages.txt contiene comentarios. Limpiando..."
    # Eliminar líneas que empiecen con #
    sed -i '/^#/d' packages.txt
    echo "✅ packages.txt limpiado"
fi

# Crear archivo de timestamp para forzar cambio
echo "# Deploy timestamp: $(date)" > deploy_timestamp.txt

# Agregar todos los archivos
git add .

# Commit con mensaje descriptivo
git commit -m "Force redeploy: Fix packages.txt and update dependencies $(date)"

# Push a GitHub
echo "📤 Subiendo cambios a GitHub..."
git push origin main

echo "✅ Cambios subidos. Streamlit Cloud debería detectar los cambios automáticamente."
echo "⏳ Espera 2-3 minutos para que se complete el deploy."
echo "🔗 Verifica en: https://share.streamlit.io" 