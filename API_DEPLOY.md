# 🚀 Despliegue de la API VinotecaFinder en Railway

## 📋 Pasos para desplegar la API

### 1. Crear cuenta en Railway
1. Ve a [Railway.app](https://railway.app/)
2. Regístrate con tu cuenta de GitHub
3. Crea un nuevo proyecto

### 2. Conectar el repositorio
1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona tu repositorio: `gomanas_vinotecas_ar`
4. Railway detectará automáticamente que es una aplicación Node.js

### 3. Configurar variables de entorno
En Railway, ve a la pestaña "Variables" y agrega:

```env
NODE_ENV=production
REQUEST_TIMEOUT=15000
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
CORS_ORIGIN=*
```

### 4. Desplegar
1. Railway comenzará automáticamente el despliegue
2. Espera a que termine (2-3 minutos)
3. Obtendrás una URL como: `https://tu-app.railway.app`

### 5. Probar la API
Una vez desplegada, prueba estos endpoints:

- **Health Check**: `https://tu-app.railway.app/api/health`
- **Búsqueda**: `https://tu-app.railway.app/api/search?location=Mendoza`

## 🔧 Configuración de la aplicación Streamlit

Una vez que tengas la URL de tu API, actualiza el archivo `app.py` en Streamlit:

```python
class VinotecaSearch:
    def __init__(self):
        self.base_url = "https://tu-app.railway.app"  # Cambia por tu URL de Railway
```

## 📊 Monitoreo

- **Logs**: Ve a la pestaña "Deployments" en Railway
- **Métricas**: Railway proporciona métricas básicas
- **Health Check**: `/api/health` para verificar el estado

## 💰 Costos

- **Plan gratuito**: 500 horas/mes
- **Plan Pro**: $5/mes para uso ilimitado

## 🚨 Troubleshooting

### Error de puerto
Si ves errores de puerto, Railway asigna automáticamente el puerto correcto.

### Error de CORS
Si hay problemas de CORS, verifica que `CORS_ORIGIN=*` esté configurado.

### Timeout
Si las búsquedas tardan mucho, aumenta `REQUEST_TIMEOUT` en las variables de entorno. 