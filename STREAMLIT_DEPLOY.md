# 🚀 Deploy en Streamlit Cloud - Guía Completa

Esta guía te ayudará a hacer deploy exitoso de VinotecaFinder Argentina en Streamlit Cloud.

## 📋 Prerrequisitos

- ✅ Repositorio en GitHub
- ✅ Credenciales de DataForSEO
- ✅ Cuenta en Streamlit Cloud

## 🔧 Configuración del Repositorio

### 1. Estructura de Archivos Requerida

```
gomanas_vinotecas_ar/
├── app.py                 # ✅ Aplicación principal
├── requirements.txt       # ✅ Dependencias Python
├── runtime.txt           # ✅ Versión Python (3.11)
├── packages.txt          # ✅ Dependencias sistema (SIN comentarios)
├── .streamlit/
│   └── config.toml       # ✅ Configuración Streamlit
└── README.md             # ✅ Documentación
```

### 2. Archivo `packages.txt` (CRÍTICO)

**❌ INCORRECTO:**
```txt
# Dependencias del sistema
build-essential
python3-dev
```

**✅ CORRECTO:**
```txt
build-essential
python3-dev
libatlas-base-dev
gfortran
ca-certificates
```

**⚠️ REGLA IMPORTANTE:** NO incluyas comentarios en `packages.txt`

## 🌐 Deploy en Streamlit Cloud

### Paso 1: Conectar Repositorio

1. Ve a [share.streamlit.io](https://share.streamlit.io)
2. Inicia sesión con GitHub
3. Haz clic en "New app"
4. Selecciona tu repositorio: `gomanas_vinotecas_ar`

### Paso 2: Configurar Aplicación

**Configuración básica:**
- **Main file path:** `app.py`
- **Python version:** `3.11` (¡IMPORTANTE!)

**Variables de entorno:**
```
DATAFORSEO_LOGIN=tu_login_real
DATAFORSEO_PASSWORD=tu_password_real
```

### Paso 3: Deploy

1. Haz clic en "Deploy!"
2. Espera 2-3 minutos para la instalación
3. Tu app estará en: `https://tu-app.streamlit.app`

## 🚨 Solución de Problemas

### Error: "Unable to locate package"

**Síntomas:**
```
E: Unable to locate package #
E: Unable to locate package Dependencias
```

**Causa:** Comentarios en `packages.txt`

**Solución:**
1. Elimina TODOS los comentarios de `packages.txt`
2. Solo deja nombres de paquetes
3. Haz commit y push
4. Redespliega en Streamlit Cloud

### Error: "pandas build failed"

**Síntomas:**
```
× Failed to download and build `pandas==2.1.1`
```

**Causa:** Incompatibilidad con Python 3.13

**Solución:**
1. Usa Python 3.11 en Streamlit Cloud
2. Actualiza `requirements.txt` con versiones flexibles
3. Incluye `packages.txt` con dependencias del sistema

### Error: "Module not found"

**Síntomas:**
```
ModuleNotFoundError: No module named 'streamlit_folium'
```

**Causa:** Dependencias faltantes

**Solución:**
1. Verifica que `requirements.txt` incluya todas las dependencias
2. Usa versiones flexibles (`>=` en lugar de `==`)
3. Incluye `streamlit-folium>=0.25.0`

### Error: "Connection refused"

**Síntomas:**
```
Error al conectar con la API: Connection refused
```

**Causa:** La app intenta conectarse a `localhost:3000`

**Solución:**
1. Configura la URL de la API para producción
2. Usa variables de entorno para la URL
3. Implementa manejo de errores de conexión

## 🔍 Verificación del Deploy

### Script de Verificación

Ejecuta localmente antes del deploy:
```bash
python check_deploy.py
```

### Checklist de Verificación

- [ ] ✅ Python 3.11 configurado
- [ ] ✅ `packages.txt` sin comentarios
- [ ] ✅ `requirements.txt` actualizado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ `app.py` sin errores de sintaxis
- [ ] ✅ Todas las dependencias instaladas

## 📊 Monitoreo

### Logs en Streamlit Cloud

1. Ve a tu aplicación en Streamlit Cloud
2. Haz clic en "Manage app"
3. Ve a la pestaña "Logs"
4. Revisa errores y warnings

### Métricas de Uso

- **Visitas:** Número de usuarios únicos
- **Tiempo de ejecución:** Duración de las sesiones
- **Errores:** Problemas reportados

## 🔄 Actualizaciones

### Para actualizar la aplicación:

1. **Haz cambios en tu código local**
2. **Commit y push a GitHub:**
   ```bash
   git add .
   git commit -m "Update: descripción de cambios"
   git push origin main
   ```
3. **Streamlit Cloud detectará cambios automáticamente**
4. **Deploy automático en 2-3 minutos**

### Rollback si algo sale mal:

1. Ve a "Manage app" en Streamlit Cloud
2. Haz clic en "Deploy history"
3. Selecciona una versión anterior
4. Haz clic en "Redeploy"

## 🎯 Optimizaciones

### Rendimiento

1. **Cache de datos:**
   ```python
   @st.cache_data
   def load_data():
       # Tu función aquí
   ```

2. **Lazy loading:**
   ```python
   if st.button("Cargar datos"):
       # Cargar solo cuando se necesite
   ```

3. **Optimizar imports:**
   ```python
   # Solo importar lo necesario
   import streamlit as st
   ```

### Seguridad

1. **Variables de entorno:** Nunca hardcodees credenciales
2. **Validación de entrada:** Sanitiza datos del usuario
3. **Rate limiting:** Implementa límites de uso

## 📞 Soporte

### Recursos Útiles

- **Documentación oficial:** [docs.streamlit.io](https://docs.streamlit.io)
- **Comunidad:** [discuss.streamlit.io](https://discuss.streamlit.io)
- **GitHub Issues:** [github.com/streamlit/streamlit](https://github.com/streamlit/streamlit)

### Contacto

Si tienes problemas específicos:
1. Revisa los logs en Streamlit Cloud
2. Ejecuta `check_deploy.py` localmente
3. Consulta la documentación oficial
4. Busca en la comunidad de Streamlit

---

**🍷 ¡Tu aplicación VinotecaFinder Argentina estará funcionando perfectamente en Streamlit Cloud!** 