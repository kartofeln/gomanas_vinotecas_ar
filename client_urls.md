# 🍷 URLs Personalizadas para Clientes - VinotecaFinder Argentina

## 🌐 URL Base de la Aplicación

Una vez desplegada en Railway, la aplicación estará disponible en:
```
https://tu-app.railway.app
```

## 📱 URLs Personalizadas por Cliente

### 🏢 **Cliente 1: Vinotecas Mendoza**
```
https://tu-app.railway.app?location=Mendoza
```
**Descripción:** Búsqueda específica de vinotecas en Mendoza
**Resultados:** 9 vinotecas reales incluyendo La Enoteca, Tradición Vinos, Sol y Vino

### 🏢 **Cliente 2: Vinotecas Palermo**
```
https://tu-app.railway.app?location=Palermo
```
**Descripción:** Búsqueda específica de vinotecas en Palermo, Buenos Aires
**Resultados:** Vinotecas del barrio más elegante de Buenos Aires

### 🏢 **Cliente 3: Vinotecas Córdoba**
```
https://tu-app.railway.app?location=Córdoba
```
**Descripción:** Búsqueda específica de vinotecas en Córdoba
**Resultados:** Vinotecas de la provincia de Córdoba

### 🏢 **Cliente 4: Vinotecas San Telmo**
```
https://tu-app.railway.app?location=San%20Telmo
```
**Descripción:** Búsqueda específica de vinotecas en San Telmo
**Resultados:** Vinotecas del barrio histórico de Buenos Aires

### 🏢 **Cliente 5: Vinotecas Recoleta**
```
https://tu-app.railway.app?location=Recoleta
```
**Descripción:** Búsqueda específica de vinotecas en Recoleta
**Resultados:** Vinotecas del barrio más exclusivo de Buenos Aires

### 🏢 **Cliente 6: Vinotecas Rosario**
```
https://tu-app.railway.app?location=Rosario
```
**Descripción:** Búsqueda específica de vinotecas en Rosario
**Resultados:** Vinotecas de la ciudad de Rosario

## 🎯 **URLs Especializadas por Tipo de Cliente**

### 🍷 **Para Bodegas**
```
https://tu-app.railway.app?location=Mendoza&type=bodegas
```

### 🏪 **Para Tiendas de Vino**
```
https://tu-app.railway.app?location=Palermo&type=tiendas
```

### 🍾 **Para Enotecas**
```
https://tu-app.railway.app?location=Recoleta&type=enotecas
```

## 📊 **URLs con Filtros Específicos**

### ⭐ **Solo Vinotecas con Calificación Alta**
```
https://tu-app.railway.app?location=Mendoza&rating=4+
```

### 🚚 **Vinotecas con Envío a Domicilio**
```
https://tu-app.railway.app?location=Palermo&delivery=true
```

### 🏪 **Vinotecas con Tienda Online**
```
https://tu-app.railway.app?location=Córdoba&online=true
```

## 🔧 **Cómo Personalizar URLs**

### **Parámetros Disponibles:**

1. **`location`** - Ubicación específica
   - Ejemplos: `Mendoza`, `Palermo`, `Córdoba`, `San Telmo`

2. **`type`** - Tipo de establecimiento
   - Valores: `vinotecas`, `bodegas`, `tiendas`, `enotecas`

3. **`rating`** - Calificación mínima
   - Valores: `4+`, `4.5+`, `5`

4. **`delivery`** - Con envío a domicilio
   - Valores: `true`, `false`

5. **`online`** - Con tienda online
   - Valores: `true`, `false`

### **Ejemplos de Combinaciones:**

```
# Vinotecas en Mendoza con calificación 4.5+
https://tu-app.railway.app?location=Mendoza&rating=4.5+

# Tiendas de vino en Palermo con envío
https://tu-app.railway.app?location=Palermo&type=tiendas&delivery=true

# Enotecas en Recoleta con tienda online
https://tu-app.railway.app?location=Recoleta&type=enotecas&online=true
```

## 📱 **URLs para Móviles**

### **Versión Móvil Optimizada:**
```
https://tu-app.railway.app?mobile=true&location=Mendoza
```

### **Aplicación Web Progresiva (PWA):**
```
https://tu-app.railway.app?pwa=true&location=Palermo
```

## 🎨 **URLs con Temas Personalizados**

### **Tema Oscuro:**
```
https://tu-app.railway.app?theme=dark&location=Mendoza
```

### **Tema Claro:**
```
https://tu-app.railway.app?theme=light&location=Palermo
```

## 📈 **URLs para Análisis**

### **URL con Tracking:**
```
https://tu-app.railway.app?location=Mendoza&utm_source=cliente1&utm_medium=web&utm_campaign=vinotecas2024
```

### **URL para A/B Testing:**
```
https://tu-app.railway.app?location=Palermo&variant=a&test=layout
```

## 🚀 **Instrucciones de Despliegue**

1. **Subir a GitHub:**
   ```bash
   git add .
   git commit -m "VinotecaFinder ready for deployment"
   git push origin main
   ```

2. **Conectar Railway:**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu repositorio de GitHub
   - Railway detectará automáticamente la configuración

3. **Configurar Variables de Entorno:**
   ```env
   DATAFORSEO_LOGIN=tu_login
   DATAFORSEO_PASSWORD=tu_password
   PORT=3000
   NODE_ENV=production
   ```

4. **Obtener URL de Producción:**
   - Railway te dará una URL como: `https://tu-app.railway.app`
   - Reemplaza `tu-app` con el nombre de tu aplicación

## 📋 **Checklist para Clientes**

- [ ] URL base funcionando
- [ ] Búsqueda por ubicación funcionando
- [ ] Datos reales de DataForSEO cargando
- [ ] Interfaz responsive en móviles
- [ ] Enlaces a Google Maps funcionando
- [ ] Información detallada en modales
- [ ] URLs personalizadas configuradas
- [ ] Tracking y analytics configurados

## 🎯 **Próximos Pasos**

1. **Desplegar en Railway**
2. **Probar todas las URLs personalizadas**
3. **Configurar dominio personalizado** (opcional)
4. **Implementar tracking de analytics**
5. **Crear documentación para clientes**

---

**🍷 VinotecaFinder Argentina - URLs Personalizadas para Clientes** 