# 🍷 VinotecaFinder Argentina

Una aplicación web moderna para buscar vinotecas en Argentina con datos en tiempo real.

## ✨ Características

- 🔍 **Búsqueda en tiempo real** de vinotecas por ubicación
- 📍 **Ubicaciones populares** predefinidas (Mendoza, Palermo, Córdoba, etc.)
- 📱 **Interfaz moderna y responsive** que funciona en móviles y desktop
- 🗺️ **Integración con Google Maps** para ver ubicaciones
- ⭐ **Calificaciones y reseñas** de las vinotecas
- 📞 **Información de contacto** (teléfonos, direcciones)
- 🚀 **Despliegue fácil** en Railway, Heroku, Vercel, etc.

## 🚀 Inicio Rápido

### Opción 1: Ejecutar Localmente

#### Windows
```bash
# Hacer doble clic en start_api.bat
# O ejecutar en PowerShell:
.\start_api.bat
```

#### Linux/Mac
```bash
# Dar permisos de ejecución
chmod +x start_api.sh

# Ejecutar
./start_api.sh
```

#### Manual
```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

### Opción 2: Desplegar en Railway

1. **Fork este repositorio** en GitHub
2. **Conecta Railway** con tu repositorio
3. **Configura las variables de entorno** (opcional):
   - `DATAFORSEO_LOGIN`: Tu login de DataForSEO
   - `DATAFORSEO_PASSWORD`: Tu password de DataForSEO
4. **Deploy automático** - Railway detectará la configuración

## 🌐 Uso

1. **Abre la aplicación** en tu navegador: `http://localhost:3000`
2. **Ingresa una ubicación** (ej: "Mendoza", "Palermo", "Córdoba")
3. **Haz clic en "Buscar"** o usa las ubicaciones populares
4. **Explora los resultados** con información detallada
5. **Usa "Más Info"** para ver detalles completos
6. **Abre en Google Maps** para ver la ubicación

## 📊 Fuentes de Datos

- **DataForSEO API** (si las credenciales están configuradas)
- **Datos simulados** como fallback
- **Google Maps** para ubicaciones
- **Búsqueda web** para información adicional

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **APIs**: DataForSEO, Google Maps
- **Deployment**: Railway, Heroku, Vercel

## 📁 Estructura del Proyecto

```
├── public/                 # Archivos estáticos
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos CSS
│   └── script.js          # JavaScript del frontend
├── server.js              # Servidor Express
├── package.json           # Dependencias Node.js
├── railway.json           # Configuración Railway
├── start_api.bat          # Script Windows
├── start_api.sh           # Script Linux/Mac
└── README.md              # Este archivo
```

## 🔧 Configuración

### Configurar DataForSEO (Datos Reales)

Para usar datos reales de vinotecas, necesitas credenciales de DataForSEO:

1. **Obtén credenciales gratuitas** en [DataForSEO](https://dataforseo.com/)
2. **Configura las credenciales**:

#### Windows
```bash
# Ejecutar el script de configuración
setup_dataforseo.bat
```

#### Linux/Mac
```bash
# Dar permisos de ejecución
chmod +x setup_dataforseo.sh

# Ejecutar el script de configuración
./setup_dataforseo.sh
```

#### Manual
```bash
# Crear archivo .env
echo "DATAFORSEO_LOGIN=tu_login" > .env
echo "DATAFORSEO_PASSWORD=tu_password" >> .env
```

### Variables de Entorno

```bash
# DataForSEO API Credentials (obligatorio para datos reales)
DATAFORSEO_LOGIN=tu_login
DATAFORSEO_PASSWORD=tu_password

# Puerto del servidor (por defecto: 3000)
PORT=3000

# Entorno (development/production)
NODE_ENV=development
```

### API Endpoints

- `GET /` - Página principal
- `GET /api/search?location=LOCATION` - Buscar vinotecas
- `GET /health` - Health check

## 🚀 Despliegue

### Railway (Recomendado)
1. Fork el repositorio
2. Conecta Railway
3. Deploy automático

### Heroku
```bash
heroku create tu-app-vinoteca
git push heroku main
```

### Vercel
```bash
npm install -g vercel
vercel
```

## 📱 URLs para Clientes

Una vez desplegado, puedes generar URLs para diferentes clientes:

- **URL Principal**: `https://tu-app.railway.app`
- **URL con Ubicación**: `https://tu-app.railway.app?location=Mendoza`
- **URL Específica**: `https://tu-app.railway.app?location=Palermo`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado
2. Ejecuta `npm install` para instalar dependencias
3. Revisa los logs del servidor
4. Abre un issue en GitHub

---

🍷 **Desarrollado con ❤️ para amantes del vino en Argentina** 