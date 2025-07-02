import streamlit as st
import pandas as pd
import plotly.express as px
import folium
from streamlit_folium import st_folium
from datetime import datetime

# Configuración de la página
st.set_page_config(
    page_title="🍷 VinotecaFinder Argentina",
    page_icon="🍷",
    layout="wide"
)

# CSS personalizado
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
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #DC143C;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# Datos simulados simples
def get_vinotecas_data(location):
    """Obtener datos simulados de vinotecas"""
    data = {
        "mendoza": [
            {"name": "Bodega La Rural", "address": "Av. San Martín 2724, Mendoza", "rating": "4.5"},
            {"name": "Vinoteca Mendoza", "address": "Belgrano 1194, Mendoza", "rating": "4.3"},
            {"name": "Wine Store Mendoza", "address": "Sarmiento 123, Mendoza", "rating": "4.7"}
        ],
        "palermo": [
            {"name": "Vinoteca Palermo", "address": "Av. Santa Fe 1234, Palermo", "rating": "4.4"},
            {"name": "Wine Bar Palermo", "address": "Gorriti 567, Palermo", "rating": "4.6"},
            {"name": "Bodega Palermo", "address": "Honduras 890, Palermo", "rating": "4.3"}
        ],
        "córdoba": [
            {"name": "Vinoteca Córdoba", "address": "Av. Hipólito Yrigoyen 123, Córdoba", "rating": "4.3"},
            {"name": "Wine Bar Córdoba", "address": "San Martín 456, Córdoba", "rating": "4.5"},
            {"name": "Bodega Córdoba", "address": "Belgrano 789, Córdoba", "rating": "4.2"}
        ]
    }
    
    location_lower = location.lower()
    return data.get(location_lower, [
        {"name": f"Vinoteca {location}", "address": f"Av. Principal 123, {location}", "rating": "4.3"},
        {"name": f"Wine Bar {location}", "address": f"San Martín 456, {location}", "rating": "4.5"}
    ])

# Función principal
def main():
    # Header principal
    st.markdown("""
    <div class="main-header">
        <h1>🍷 VinotecaFinder Argentina</h1>
        <p>Descubre las mejores vinotecas de Argentina</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Formulario de búsqueda
    st.markdown("### 🔍 Buscar Vinotecas")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        location = st.text_input(
            "📍 Ubicación",
            placeholder="Ej: Mendoza, Palermo, Córdoba...",
            help="Ingresa el nombre de la ciudad"
        )
    
    with col2:
        search_button = st.button("🔍 Buscar", type="primary", use_container_width=True)
    
    # Ubicaciones populares
    st.markdown("### 📍 Ubicaciones Populares")
    popular_locations = ["Mendoza", "Palermo", "Córdoba"]
    
    cols = st.columns(len(popular_locations))
    for i, loc in enumerate(popular_locations):
        with cols[i]:
            if st.button(loc, key=f"btn_{loc}"):
                location = loc
                search_button = True
    
    # Realizar búsqueda
    if search_button and location:
        st.info(f"🔍 Buscando vinotecas en: {location}")
        
        # Obtener datos
        vinotecas = get_vinotecas_data(location)
        
        if vinotecas:
            st.success(f"✅ Se encontraron {len(vinotecas)} vinotecas en {location}")
            
            # Mostrar estadísticas
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Total Vinotecas", len(vinotecas))
            with col2:
                st.metric("Calificación Promedio", "4.4")
            with col3:
                st.metric("Última Actualización", datetime.now().strftime("%H:%M"))
            
            # Mostrar resultados
            st.markdown("### 🍷 Vinotecas Encontradas")
            
            for vinoteca in vinotecas:
                st.markdown(f"""
                <div class="vinoteca-card">
                    <h4>🍷 {vinoteca['name']}</h4>
                    <p><strong>📍 Dirección:</strong> {vinoteca['address']}</p>
                    <p><strong>⭐ Calificación:</strong> {vinoteca['rating']}</p>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.warning(f"⚠️ No se encontraron vinotecas en {location}")
    
    # Información adicional
    st.markdown("---")
    st.markdown("### ℹ️ Acerca de")
    st.markdown("""
    **🍷 VinotecaFinder Argentina** es una aplicación que te ayuda a descubrir las mejores vinotecas de Argentina.
    
    ### 🚀 Características
    - 🔍 Búsqueda por ciudad
    - 📊 Estadísticas en tiempo real
    - 📱 Interfaz moderna y responsive
    
    **Versión**: 1.0.0
    **Última actualización**: """ + datetime.now().strftime("%d/%m/%Y %H:%M"))

# Ejecutar la aplicación
if __name__ == "__main__":
    main() 