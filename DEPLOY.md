# 🚀 Guía de Deploy - VinotecaFinder Argentina

Esta guía te ayudará a hacer deploy de la aplicación VinotecaFinder Argentina en diferentes plataformas.

## 📋 Prerrequisitos

- Cuenta en GitHub
- Credenciales de DataForSEO (obligatorio)
- Cuenta en la plataforma de deploy elegida

## 🔧 Preparación del Proyecto

### 1. Configurar Variables de Entorno

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env
   ```

2. **Edita el archivo `.env` con tus credenciales:**
   ```env
   DATAFORSEO_LOGIN=tu_login_real
   DATAFORSEO_PASSWORD=tu_password_real
   PORT=3000
   ```

3. **Verifica que `.env` esté en `.gitignore`** (ya incluido)

### 2. Subir a GitHub

```bash
# Inicializar repositorio (si no existe)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: VinotecaFinder Argentina"

# Agregar remoto
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# Subir a GitHub
git push -u origin main
```

## 🌐 Opciones de Deploy

### 1. Streamlit Cloud (Recomendado)

**Ventajas:** Gratis, fácil de configurar, perfecto para aplicaciones Streamlit

#### Pasos:

1. **Ve a [share.streamlit.io](https://share.streamlit.io)**
2. **Conecta tu cuenta de GitHub**
3. **Selecciona tu repositorio**
4. **Configura la aplicación:**
   - **Main file path:** `app.py`
   - **Python version:** 3.11
5. **Configura variables de entorno:**
   - `DATAFORSEO_LOGIN`
   - `DATAFORSEO_PASSWORD`
6. **Haz clic en "Deploy"**

#### URL resultante:
```
https://tu-app.streamlit.app
```

### 2. Heroku

**Ventajas:** Robusto, escalable, bueno para aplicaciones complejas

#### Pasos:

1. **Instala Heroku CLI:**
   ```bash
   # Windows
   winget install --id=Heroku.HerokuCLI
   
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login en Heroku:**
   ```bash
   heroku login
   ```

3. **Crear aplicación:**
   ```bash
   heroku create tu-app-name
   ```

4. **Configurar variables de entorno:**
   ```bash
   heroku config:set DATAFORSEO_LOGIN=tu_login
   heroku config:set DATAFORSEO_PASSWORD=tu_password
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

#### URL resultante:
```
https://tu-app-name.herokuapp.com
```

### 3. Railway

**Ventajas:** Simple, automático, bueno para proyectos pequeños

#### Pasos:

1. **Ve a [railway.app](https://railway.app)**
2. **Conecta tu cuenta de GitHub**
3. **Selecciona tu repositorio**
4. **Configura variables de entorno en la interfaz**
5. **Deploy automático**

### 4. Vercel

**Ventajas:** Rápido, bueno para aplicaciones web

#### Pasos:

1. **Ve a [vercel.com](https://vercel.com)**
2. **Conecta tu cuenta de GitHub**
3. **Importa tu repositorio**
4. **Configura el build command:**
   ```
   pip install -r requirements.txt && streamlit run app.py
   ```
5. **Configura variables de entorno**
6. **Deploy**

## 🔒 Configuración de Seguridad

### Variables de Entorno Sensibles

**NUNCA** subas estas variables a GitHub:
- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`
- `JWT_SECRET`
- Cualquier clave API

### Configuración de CORS

Para aplicaciones web, configura CORS apropiadamente:

```javascript
// En server.js
app.use(cors({
  origin: ['https://tu-dominio.com', 'http://localhost:3000'],
  credentials: true
}));
```

## 📊 Monitoreo y Logs

### Streamlit Cloud
- Logs automáticos en la interfaz
- Métricas de uso incluidas

### Heroku
```bash
# Ver logs en tiempo real
heroku logs --tail

# Ver métricas
heroku addons:open papertrail
```

### Railway
- Logs automáticos en la interfaz
- Métricas incluidas

## 🚨 Solución de Problemas

### Error: "Module not found"
```bash
# Verificar dependencias
pip install -r requirements.txt
npm install
```

### Error: "Environment variables not set"
- Verifica que las variables estén configuradas en la plataforma
- Asegúrate de que los nombres coincidan exactamente

### Error: "Port already in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: "DataForSEO credentials invalid"
- Verifica que las credenciales sean correctas
- Asegúrate de que la cuenta tenga saldo disponible

## 🔄 Actualizaciones

### Para actualizar la aplicación:

1. **Haz cambios en tu código local**
2. **Commit y push a GitHub:**
   ```bash
   git add .
   git commit -m "Update: descripción de cambios"
   git push origin main
   ```
3. **Deploy automático** (Streamlit Cloud, Railway, Vercel)
4. **Deploy manual** (Heroku):
   ```bash
   git push heroku main
   ```

## 📈 Escalabilidad

### Para aplicaciones con mucho tráfico:

1. **Implementa cache:**
   ```javascript
   const cache = require('memory-cache');
   ```

2. **Rate limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   ```

3. **Load balancing** (Heroku, Railway)

4. **CDN** para archivos estáticos

## 🎯 Próximos Pasos

1. **Configura un dominio personalizado**
2. **Implementa analytics** (Google Analytics, Mixpanel)
3. **Configura alertas** de monitoreo
4. **Implementa CI/CD** con GitHub Actions
5. **Configura backups** automáticos

## 📞 Soporte

Si tienes problemas con el deploy:

- **Streamlit Cloud:** [Documentación oficial](https://docs.streamlit.io/streamlit-community-cloud)
- **Heroku:** [Documentación oficial](https://devcenter.heroku.com/)
- **Railway:** [Documentación oficial](https://docs.railway.app/)
- **Vercel:** [Documentación oficial](https://vercel.com/docs)

---

**🍷 ¡Tu aplicación VinotecaFinder Argentina está lista para el mundo!** 