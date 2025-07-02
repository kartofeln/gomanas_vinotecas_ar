# 🍷 VinotecaFinder Argentina

Una aplicación web moderna para buscar vinotecas en Argentina usando web scraping, APIs y una interfaz Streamlit elegante.

## 🚀 Características

- 🔍 **Búsqueda inteligente** en múltiples fuentes
- 📊 **Datos en tiempo real** de vinotecas argentinas
- 🗺️ **Mapas interactivos** con ubicaciones
- 📱 **Interfaz moderna con Streamlit**
- 📈 **Estadísticas y gráficos** en tiempo real
- 🔄 **Actualización automática** de datos

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, Axios, Cheerio
- **Frontend**: Streamlit, Plotly, Folium
- **APIs**: DataForSEO, Google Maps
- **Scraping**: Web scraping inteligente
- **Deploy**: Heroku, Vercel, Railway, Streamlit Cloud

## 📦 Instalación

### Prerrequisitos

- Python 3.8+
- Node.js (v18 o superior)
- pip y npm

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd vinoteca-search-argentina
   ```

2. **Instalar dependencias de Python**
   ```bash
   pip install -r requirements.txt
   ```

3. **Instalar dependencias de Node.js**
   ```bash
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   DATAFORSEO_LOGIN=tu_login
   DATAFORSEO_PASSWORD=tu_password
   PORT=3000
   ```

5. **Ejecutar la aplicación**

   **Opción A: Solo Streamlit (recomendado para deploy)**
   ```bash
   streamlit run app.py
   ```

   **Opción B: Backend + Frontend completo**
   ```bash
   # Terminal 1: Backend Node.js
   npm start
   
   # Terminal 2: Frontend Streamlit
   streamlit run app.py
   ```

6. **Acceder a la aplicación**
   - Streamlit: http://localhost:8501
   - API Node.js: http://localhost:3000/api/search

## 🎯 Uso

### Interfaz Streamlit

La aplicación Streamlit incluye:

- **🔍 Buscar Vinotecas**: Búsqueda principal con ubicaciones populares
- **📊 Estadísticas**: Gráficos y métricas de los resultados
- **🗺️ Mapa**: Visualización interactiva de ubicaciones
- **ℹ️ Acerca de**: Información del proyecto

### API Endpoints

- `GET /api/search?location=Palermo` - Buscar vinotecas en una ubicación

### Ejemplo de respuesta

```json
{
  "success": true,
  "location": "Palermo",
  "vinotecas": [
    {
      "name": "Vinoteca Palermo",
      "address": "Av. Santa Fe 1234, Palermo",
      "rating": "4.5",
      "source": "Google Maps"
    }
  ]
}
```

## 📍 Fuentes de Datos

- **Google Maps**: Búsqueda local de vinotecas
- **DataForSEO**: API de datos de negocios
- **Guía Oleo**: Directorio gastronómico argentino
- **TripAdvisor**: Reseñas y recomendaciones
- **Búsquedas locales**: Scraping de sitios argentinos

## 🚀 Deploy

### Streamlit Cloud (Recomendado)

1. **Subir a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar a Streamlit Cloud**
   - Ve a [share.streamlit.io](https://share.streamlit.io)
   - Conecta tu repositorio de GitHub
   - Configura el archivo principal: `app.py`
   - **Python version:** 3.11 (importante para compatibilidad)
   - Configura variables de entorno si es necesario

3. **Configurar variables de entorno**
   - `DATAFORSEO_LOGIN`: Tu login de DataForSEO
   - `DATAFORSEO_PASSWORD`: Tu password de DataForSEO

4. **Deploy automático**
   - Streamlit Cloud detectará cambios automáticamente
   - Tu app estará disponible en `https://tu-app.streamlit.app`

**⚠️ Nota importante:** Si ves errores de compilación de pandas, asegúrate de:
- Usar Python 3.11 en Streamlit Cloud
- Tener todas las dependencias actualizadas en `requirements.txt`
- El archivo `packages.txt` incluye dependencias del sistema necesarias
- **IMPORTANTE**: El archivo `packages.txt` NO debe contener comentarios, solo nombres de paquetes
- **SOLUCIÓN RÁPIDA**: Si persisten errores, haz un commit vacío para forzar redeploy

### Heroku

1. **Crear aplicación en Heroku**
   ```bash
   heroku create tu-app-name
   ```

2. **Configurar variables de entorno**
   ```bash
   heroku config:set DATAFORSEO_LOGIN=tu_login
   heroku config:set DATAFORSEO_PASSWORD=tu_password
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Railway

1. **Conectar repositorio a Railway**
2. **Configurar variables de entorno**
3. **Deploy automático**

### Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar build command**: `pip install -r requirements.txt && streamlit run app.py`
3. **Configurar variables de entorno**

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DATAFORSEO_LOGIN` | Login de DataForSEO | Sí |
| `DATAFORSEO_PASSWORD` | Password de DataForSEO | Sí |
| `PORT` | Puerto del servidor Node.js | No (default: 3000) |

### Personalización

Puedes modificar las fuentes de datos editando `server.js`:

```javascript
// Agregar nueva fuente
const searchNewSource = async (location) => {
  // Tu lógica de búsqueda
};
```

## 📊 Estructura del Proyecto

```
vinoteca-search-argentina/
├── app.py                 # Aplicación principal Streamlit
├── server.js              # Servidor Node.js (API)
├── dataforseo_client.js   # Cliente DataForSEO
├── utils.js               # Utilidades
├── requirements.txt       # Dependencias Python
├── package.json           # Dependencias Node.js
├── .streamlit/            # Configuración Streamlit
│   └── config.toml        # Tema y configuración
├── Procfile               # Configuración para Heroku
├── runtime.txt            # Versión de Python
├── setup.sh               # Script de instalación
├── .env.example           # Variables de entorno ejemplo
└── README.md              # Este archivo
```

## 🎨 Personalización

### Tema Streamlit

Edita `.streamlit/config.toml` para personalizar el tema:

```toml
[theme]
primaryColor = "#DC143C"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
```

### Agregar nuevas funcionalidades

1. **Nuevas páginas**: Agrega opciones al menú en `app.py`
2. **Nuevas fuentes de datos**: Modifica `server.js`
3. **Nuevos gráficos**: Usa Plotly en `app.py`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o sugerencias:

- 📧 Email: tu-email@ejemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/tu-repo/issues)
- 💬 Discord: [Tu servidor Discord]

## 🙏 Agradecimientos

- DataForSEO por proporcionar datos de alta calidad
- Streamlit por la excelente plataforma de desarrollo
- La comunidad de desarrolladores argentinos
- Todos los contribuidores del proyecto

---

**🍷 ¡Disfruta explorando las mejores vinotecas de Argentina con nuestra aplicación Streamlit!** 