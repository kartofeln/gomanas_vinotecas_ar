# Nueva aplicación Streamlit - Sin cache
import streamlit as st
import requests
import pandas as pd
from datetime import datetime

st.set_page_config(
    page_title="🍷 VinotecaFinder Argentina",
    page_icon="🍷",
    layout="wide"
)

# CSS simple
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #8B0000, #DC143C);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .vinoteca-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #DC143C;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="main-header">
    <h1>🍷 VinotecaFinder Argentina</h1>
    <p>Busca vinotecas en Argentina usando nuestra API local</p>
</div>
""", unsafe_allow_html=True)

# Función para buscar vinotecas
def search_vinotecas(location):
    """Buscar vinotecas usando la API local"""
    try:
        url = "http://localhost:3000/api/search"
        params = {"location": location}
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.ConnectionError:
        st.error("❌ No se puede conectar con la API local. Asegúrate de que el servidor esté corriendo en localhost:3000")
        return None
    except requests.exceptions.Timeout:
        st.error("⏰ La búsqueda tardó demasiado. Intenta de nuevo.")
        return None
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")
        return None

# Interfaz principal
st.write("### 🔍 Buscar Vinotecas")

# Campo de búsqueda
location = st.text_input(
    "📍 Ubicación",
    placeholder="Ej: Mendoza, Palermo, Córdoba...",
    help="Ingresa el nombre de la ciudad donde quieres buscar vinotecas"
)

# Botones de ubicaciones populares
st.write("### 📍 Ubicaciones Populares")
col1, col2, col3 = st.columns(3)

with col1:
    if st.button("🍷 Mendoza", use_container_width=True):
        location = "Mendoza"

with col2:
    if st.button("🏛️ Córdoba", use_container_width=True):
        location = "Córdoba"

with col3:
    if st.button("🌳 Palermo", use_container_width=True):
        location = "Palermo"

# Realizar búsqueda
if location:
    st.write(f"### 🔍 Buscando vinotecas en: {location}")
    
    with st.spinner("Buscando vinotecas..."):
        result = search_vinotecas(location)
        
        if result and result.get('success'):
            vinotecas = result.get('vinotecas', [])
            
            if vinotecas:
                st.success(f"✅ Se encontraron {len(vinotecas)} vinotecas en {location}")
                
                # Mostrar estadísticas
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Total Vinotecas", len(vinotecas))
                with col2:
                    sources = set(v.get('source', 'Desconocido') for v in vinotecas)
                    st.metric("Fuentes", len(sources))
                with col3:
                    st.metric("Última Actualización", datetime.now().strftime("%H:%M"))
                
                # Mostrar resultados
                st.write("### 🍷 Vinotecas Encontradas")
                
                for vinoteca in vinotecas:
                    with st.container():
                        st.markdown(f"""
                        <div class="vinoteca-card">
                            <h4>🍷 {vinoteca.get('name', 'Sin nombre')}</h4>
                            <p><strong>📍 Dirección:</strong> {vinoteca.get('address', 'No disponible')}</p>
                            <p><strong>⭐ Calificación:</strong> {vinoteca.get('rating', 'No disponible')}</p>
                            <p><strong>📡 Fuente:</strong> {vinoteca.get('source', 'Desconocido')}</p>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Botón para ver en Google Maps
                        if st.button(f"🗺️ Ver en Maps", key=f"maps_{vinoteca.get('name', '')}"):
                            maps_url = f"https://www.google.com/maps/search/{vinoteca.get('name', '')}+{vinoteca.get('address', '')}"
                            st.markdown(f"[Abrir en Google Maps]({maps_url})")
                        
                        st.divider()
            else:
                st.warning(f"⚠️ No se encontraron vinotecas en {location}")
        else:
            st.error("❌ No se pudieron obtener resultados de la API")

# Información adicional
st.write("---")
st.write("### ℹ️ Información")
st.write("Esta aplicación se conecta a una API local que debe estar corriendo en `localhost:3000`")
st.write("Para iniciar la API, ejecuta: `node server.js` en la terminal")

# Estado de la API
st.write("### 🔌 Estado de la API")
if st.button("🔍 Verificar conexión con la API"):
    try:
        response = requests.get("http://localhost:3000/api/health", timeout=5)
        if response.status_code == 200:
            st.success("✅ API conectada y funcionando")
        else:
            st.warning("⚠️ API responde pero con error")
    except:
        st.error("❌ No se puede conectar con la API en localhost:3000") 