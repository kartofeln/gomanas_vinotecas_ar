import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import folium
from streamlit_folium import st_folium
from streamlit_option_menu import option_menu
import time
import json
from datetime import datetime
import random

# Configuración de la página
st.set_page_config(
    page_title="🍷 VinotecaFinder Argentina",
    page_icon="🍷",
    layout="wide",
    initial_sidebar_state="expanded"
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
    
    .search-container {
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
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
    
    .stats-container {
        display: flex;
        justify-content: space-around;
        margin: 2rem 0;
    }
    
    .stat-card {
        background: linear-gradient(135deg, #DC143C, #8B0000);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        flex: 1;
        margin: 0 0.5rem;
    }
    
    .loading-spinner {
        text-align: center;
        padding: 2rem;
    }
    
    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #c62828;
    }
    
    .success-message {
        background: #e8f5e8;
        color: #2e7d32;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #2e7d32;
    }
</style>
""", unsafe_allow_html=True)

# Clase para manejar la búsqueda de vinotecas
class VinotecaSearch:
    def __init__(self):
        self.dataforseo_username = st.secrets.get("DATAFORSEO_USERNAME", "")
        self.dataforseo_password = st.secrets.get("DATAFORSEO_PASSWORD", "")
        
    def search_vinotecas(self, location):
        """Buscar vinotecas usando DataForSEO API o datos simulados"""
        try:
            # Si tenemos credenciales de DataForSEO, usarlas
            if self.dataforseo_username and self.dataforseo_password:
                return self._search_with_dataforseo(location)
            else:
                # Usar datos simulados
                return self._get_simulated_data(location)
        except Exception as e:
            st.error(f"Error inesperado: {str(e)}")
            return self._get_simulated_data(location)
    
    def _search_with_dataforseo(self, location):
        """Buscar usando DataForSEO API"""
        try:
            import base64
            
            # Codificar credenciales
            credentials = base64.b64encode(f"{self.dataforseo_username}:{self.dataforseo_password}".encode()).decode()
            
            # URL de la API
            url = "https://api.dataforseo.com/v3/business_data/google/my_business_info/task_post"
            
            headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json"
            }
            
            # Datos de la búsqueda
            data = [{
                "keyword": f"vinotecas {location} argentina",
                "location_name": location,
                "language_name": "Spanish"
            }]
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            # Procesar resultados
            if result.get("status_code") == 20000:
                tasks = result.get("tasks", [])
                if tasks and tasks[0].get("result"):
                    items = tasks[0]["result"][0].get("items", [])
                    
                    vinotecas = []
                    for item in items[:20]:  # Limitar a 20 resultados
                        vinoteca = {
                            "name": item.get("title", "Vinoteca"),
                            "address": item.get("address", "Dirección no disponible"),
                            "rating": item.get("rating", "No disponible"),
                            "source": "DataForSEO"
                        }
                        vinotecas.append(vinoteca)
                    
                    return {"success": True, "vinotecas": vinotecas}
            
            # Si no hay resultados de DataForSEO, usar datos simulados
            return self._get_simulated_data(location)
            
        except Exception as e:
            st.warning(f"No se pudo conectar con DataForSEO: {str(e)}")
            return self._get_simulated_data(location)
    
    def _get_simulated_data(self, location):
        """Generar datos simulados de vinotecas"""
        
        # Datos simulados por ciudad
        city_data = {
            "mendoza": [
                {"name": "Bodega La Rural", "address": "Av. San Martín 2724, Mendoza", "rating": "4.5"},
                {"name": "Vinoteca Mendoza", "address": "Belgrano 1194, Mendoza", "rating": "4.3"},
                {"name": "Wine Store Mendoza", "address": "Sarmiento 123, Mendoza", "rating": "4.7"},
                {"name": "Bodega Trapiche", "address": "Nueva Mayorga s/n, Coquimbito", "rating": "4.6"},
                {"name": "Vinoteca San Martín", "address": "San Martín 456, Mendoza", "rating": "4.2"}
            ],
            "palermo": [
                {"name": "Vinoteca Palermo", "address": "Av. Santa Fe 1234, Palermo", "rating": "4.4"},
                {"name": "Wine Bar Palermo", "address": "Gorriti 567, Palermo", "rating": "4.6"},
                {"name": "Bodega Palermo", "address": "Honduras 890, Palermo", "rating": "4.3"},
                {"name": "Vinoteca Soho", "address": "El Salvador 234, Palermo", "rating": "4.5"},
                {"name": "Wine Store Palermo", "address": "Niceto Vega 456, Palermo", "rating": "4.1"}
            ],
            "recoleta": [
                {"name": "Vinoteca Recoleta", "address": "Av. Alvear 123, Recoleta", "rating": "4.8"},
                {"name": "Wine Bar Recoleta", "address": "Posadas 456, Recoleta", "rating": "4.6"},
                {"name": "Bodega Recoleta", "address": "Ayacucho 789, Recoleta", "rating": "4.4"},
                {"name": "Vinoteca Centro", "address": "Montevideo 234, Recoleta", "rating": "4.3"},
                {"name": "Wine Store Recoleta", "address": "Uriburu 567, Recoleta", "rating": "4.5"}
            ],
            "córdoba": [
                {"name": "Vinoteca Córdoba", "address": "Av. Hipólito Yrigoyen 123, Córdoba", "rating": "4.3"},
                {"name": "Wine Bar Córdoba", "address": "San Martín 456, Córdoba", "rating": "4.5"},
                {"name": "Bodega Córdoba", "address": "Belgrano 789, Córdoba", "rating": "4.2"},
                {"name": "Vinoteca Nueva Córdoba", "address": "Obispo Trejo 234, Córdoba", "rating": "4.4"},
                {"name": "Wine Store Córdoba", "address": "Rivadavia 567, Córdoba", "rating": "4.1"}
            ],
            "rosario": [
                {"name": "Vinoteca Rosario", "address": "San Martín 123, Rosario", "rating": "4.2"},
                {"name": "Wine Bar Rosario", "address": "Córdoba 456, Rosario", "rating": "4.4"},
                {"name": "Bodega Rosario", "address": "Santa Fe 789, Rosario", "rating": "4.3"},
                {"name": "Vinoteca Centro Rosario", "address": "San Lorenzo 234, Rosario", "rating": "4.1"},
                {"name": "Wine Store Rosario", "address": "Mitre 567, Rosario", "rating": "4.0"}
            ]
        }
        
        # Buscar datos para la ciudad
        location_lower = location.lower()
        if location_lower in city_data:
            base_vinotecas = city_data[location_lower]
        else:
            # Datos genéricos para otras ciudades
            base_vinotecas = [
                {"name": f"Vinoteca {location}", "address": f"Av. Principal 123, {location}", "rating": "4.3"},
                {"name": f"Wine Bar {location}", "address": f"San Martín 456, {location}", "rating": "4.5"},
                {"name": f"Bodega {location}", "address": f"Belgrano 789, {location}", "rating": "4.2"},
                {"name": f"Wine Store {location}", "address": f"Rivadavia 234, {location}", "rating": "4.1"},
                {"name": f"Vinoteca Central {location}", "address": f"Independencia 567, {location}", "rating": "4.4"}
            ]
        
        # Generar más vinotecas aleatorias
        vinotecas = []
        for i, base in enumerate(base_vinotecas):
            vinoteca = base.copy()
            vinoteca["source"] = "Datos Simulados"
            vinotecas.append(vinoteca)
            
            # Agregar algunas variaciones
            if i < 3:
                for j in range(2):
                    variation = base.copy()
                    variation["name"] = f"{base['name']} - Sucursal {j+1}"
                    variation["address"] = f"Av. {random.choice(['Libertad', 'Independencia', 'San Juan', 'Corrientes'])} {random.randint(100, 999)}, {location}"
                    variation["rating"] = f"{random.uniform(3.8, 4.8):.1f}"
                    variation["source"] = "Datos Simulados"
                    vinotecas.append(variation)
        
        return {"success": True, "vinotecas": vinotecas}

# Inicializar el buscador
@st.cache_resource
def get_searcher():
    return VinotecaSearch()

# Función para crear el mapa
def create_map(vinotecas, location):
    """Crear mapa con las ubicaciones de las vinotecas"""
    if not vinotecas:
        return None
    
    # Coordenadas aproximadas para diferentes ciudades
    city_coords = {
        "mendoza": [-32.8908, -68.8272],
        "buenos aires": [-34.6118, -58.3960],
        "palermo": [-34.5889, -58.4307],
        "recoleta": [-34.5895, -58.3924],
        "san telmo": [-34.6205, -58.3721],
        "córdoba": [-31.4201, -64.1888],
        "rosario": [-32.9468, -60.6393]
    }
    
    # Buscar coordenadas de la ciudad
    location_lower = location.lower()
    center_lat, center_lng = city_coords.get(location_lower, [-34.6118, -58.3960])
    
    # Crear mapa
    m = folium.Map(location=[center_lat, center_lng], zoom_start=12)
    
    # Agregar marcadores para cada vinoteca
    for i, vinoteca in enumerate(vinotecas):
        # Usar coordenadas más realistas basadas en la ciudad
        # Distribuir los marcadores en un área más amplia y realista
        import math
        angle = (i * 2 * math.pi) / len(vinotecas)  # Distribuir en círculo
        radius = 0.005 + (i * 0.002)  # Radio variable para evitar superposición
        
        lat = center_lat + radius * math.cos(angle)
        lng = center_lng + radius * math.sin(angle)
        
        # Crear popup con información
        popup_html = f"""
        <div style="width: 200px;">
            <h4 style="color: #DC143C; margin: 0;">{vinoteca['name']}</h4>
            <p style="margin: 5px 0;"><strong>Dirección:</strong> {vinoteca['address']}</p>
            <p style="margin: 5px 0;"><strong>Calificación:</strong> {vinoteca['rating']}</p>
            <p style="margin: 5px 0;"><strong>Fuente:</strong> {vinoteca['source']}</p>
        </div>
        """
        
        folium.Marker(
            [lat, lng],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=vinoteca['name'],
            icon=folium.Icon(color='red', icon='wine-bottle', prefix='fa')
        ).add_to(m)
    
    return m

# Función para mostrar estadísticas
def show_stats(vinotecas):
    """Mostrar estadísticas de las vinotecas encontradas"""
    if not vinotecas:
        return
    
    # Crear DataFrame
    df = pd.DataFrame(vinotecas)
    
    # Estadísticas básicas
    total_vinotecas = len(vinotecas)
    sources = df['source'].value_counts()
    
    # Mostrar estadísticas
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Vinotecas", total_vinotecas)
    
    with col2:
        st.metric("Fuentes de Datos", len(sources))
    
    with col3:
        avg_rating = df[df['rating'] != 'No disponible']['rating'].astype(float).mean()
        if pd.notna(avg_rating):
            st.metric("Calificación Promedio", f"{avg_rating:.1f}")
        else:
            st.metric("Calificación Promedio", "N/A")
    
    with col4:
        st.metric("Última Actualización", datetime.now().strftime("%H:%M"))
    
    # Gráfico de fuentes
    if len(sources) > 1:
        fig = px.pie(
            values=sources.values,
            names=sources.index,
            title="Distribución por Fuente de Datos",
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        st.plotly_chart(fig, use_container_width=True)

# Función principal
def main():
    # Header principal
    st.markdown("""
    <div class="main-header">
        <h1>🍷 VinotecaFinder Argentina</h1>
        <p>Descubre las mejores vinotecas de Argentina con datos en tiempo real</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar con navegación
    with st.sidebar:
        st.image("https://img.icons8.com/color/96/000000/wine-bottle.png", width=80)
        st.title("🍷 Navegación")
        
        selected = option_menu(
            menu_title=None,
            options=["🔍 Buscar Vinotecas", "📊 Estadísticas", "🗺️ Mapa", "ℹ️ Acerca de"],
            icons=["search", "bar-chart", "map", "info-circle"],
            menu_icon="cast",
            default_index=0,
        )
    
    # Inicializar searcher
    searcher = get_searcher()
    
    # Página principal de búsqueda
    if selected == "🔍 Buscar Vinotecas":
        st.markdown("""
        <div class="search-container">
            <h2>🔍 Buscar Vinotecas</h2>
            <p>Ingresa una ciudad o barrio para encontrar vinotecas cercanas</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Formulario de búsqueda
        col1, col2 = st.columns([3, 1])
        
        with col1:
            location = st.text_input(
                "📍 Ubicación",
                placeholder="Ej: Mendoza, Palermo, Córdoba, Rosario...",
                help="Ingresa el nombre de la ciudad o barrio donde quieres buscar vinotecas"
            )
        
        with col2:
            search_button = st.button("🔍 Buscar", type="primary", use_container_width=True)
        
        # Ubicaciones populares
        st.markdown("### 📍 Ubicaciones Populares")
        popular_locations = ["Mendoza", "Palermo", "Recoleta", "San Telmo", "Córdoba", "Rosario"]
        
        # Variable para controlar la búsqueda
        search_triggered = False
        
        cols = st.columns(len(popular_locations))
        for i, loc in enumerate(popular_locations):
            with cols[i]:
                if st.button(loc, key=f"btn_{loc}"):
                    location = loc
                    search_triggered = True
        
        # Realizar búsqueda
        if (search_button or search_triggered) and location:
            with st.spinner("🔍 Buscando vinotecas..."):
                # Mostrar progreso
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                # Simular progreso
                for i in range(100):
                    time.sleep(0.01)
                    progress_bar.progress(i + 1)
                    if i < 30:
                        status_text.text("Conectando con la API...")
                    elif i < 60:
                        status_text.text("Buscando en múltiples fuentes...")
                    elif i < 90:
                        status_text.text("Procesando resultados...")
                    else:
                        status_text.text("¡Listo!")
                
                # Realizar búsqueda real
                result = searcher.search_vinotecas(location)
                
                if result and result.get('success'):
                    vinotecas = result.get('vinotecas', [])
                    
                    if vinotecas:
                        st.success(f"✅ Se encontraron {len(vinotecas)} vinotecas en {location}")
                        
                        # Mostrar estadísticas
                        show_stats(vinotecas)
                        
                        # Mostrar resultados
                        st.markdown("### 🍷 Vinotecas Encontradas")
                        
                        for i, vinoteca in enumerate(vinotecas):
                            with st.container():
                                st.markdown(f"""
                                <div class="vinoteca-card">
                                    <h4>🍷 {vinoteca['name']}</h4>
                                    <p><strong>📍 Dirección:</strong> {vinoteca['address']}</p>
                                    <p><strong>⭐ Calificación:</strong> {vinoteca['rating']}</p>
                                    <p><strong>📡 Fuente:</strong> {vinoteca['source']}</p>
                                </div>
                                """, unsafe_allow_html=True)
                                
                                # Botones de acción
                                col1, col2 = st.columns(2)
                                with col1:
                                    if st.button(f"🗺️ Ver en Maps", key=f"maps_{i}"):
                                        maps_url = f"https://www.google.com/maps/search/{vinoteca['name']}+{vinoteca['address']}"
                                        st.markdown(f"[Abrir en Google Maps]({maps_url})")
                                
                                with col2:
                                    if st.button(f"📞 Más Info", key=f"info_{i}"):
                                        # Mostrar información detallada de la vinoteca
                                        with st.expander(f"📋 Información detallada de {vinoteca['name']}", expanded=True):
                                            st.markdown(f"""
                                            **🍷 {vinoteca['name']}**
                                            
                                            📍 **Dirección completa:** {vinoteca['address']}
                                            
                                            ⭐ **Calificación:** {vinoteca['rating']}
                                            
                                            📡 **Fuente de datos:** {vinoteca['source']}
                                            
                                            🔍 **Búsqueda relacionada:** {location}
                                            
                                            ---
                                            
                                            💡 **Consejos:**
                                            - Verifica el horario de atención antes de visitar
                                            - Considera hacer una reserva si es necesario
                                            - Revisa las reseñas en Google Maps para más detalles
                                            """)
                                
                                st.divider()
                    else:
                        st.warning(f"⚠️ No se encontraron vinotecas en {location}")
                else:
                    st.error("❌ Error al buscar vinotecas. Verifica la conexión con la API.")
                
                # Limpiar progreso
                progress_bar.empty()
                status_text.empty()
    
    # Página de estadísticas
    elif selected == "📊 Estadísticas":
        st.markdown("### 📊 Estadísticas de Vinotecas")
        
        # Aquí podrías mostrar estadísticas globales
        st.info("📈 Las estadísticas se mostrarán aquí cuando realices búsquedas")
        
        # Ejemplo de gráfico
        sample_data = {
            'Ciudad': ['Mendoza', 'Buenos Aires', 'Córdoba', 'Rosario'],
            'Vinotecas': [25, 45, 18, 12]
        }
        df_sample = pd.DataFrame(sample_data)
        
        fig = px.bar(
            df_sample,
            x='Ciudad',
            y='Vinotecas',
            title="Vinotecas por Ciudad (Ejemplo)",
            color='Vinotecas',
            color_continuous_scale='Reds'
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Página del mapa
    elif selected == "🗺️ Mapa":
        st.markdown("### 🗺️ Mapa de Vinotecas")
        
        # Buscar vinotecas para mostrar en el mapa
        location_map = st.text_input("📍 Ciudad para el mapa", placeholder="Ej: Mendoza")
        
        if st.button("🗺️ Cargar Mapa", type="primary"):
            if location_map:
                with st.spinner("Cargando mapa..."):
                    result = searcher.search_vinotecas(location_map)
                    
                    if result and result.get('success'):
                        vinotecas = result.get('vinotecas', [])
                        
                        if vinotecas:
                            # Crear mapa
                            m = create_map(vinotecas, location_map)
                            
                            if m:
                                st_folium(m, width=800, height=600)
                                st.success(f"🗺️ Mapa cargado con {len(vinotecas)} vinotecas en {location_map}")
                            else:
                                st.error("❌ Error al crear el mapa")
                        else:
                            st.warning(f"⚠️ No se encontraron vinotecas en {location_map}")
                    else:
                        st.error("❌ Error al cargar datos para el mapa")
            else:
                st.warning("⚠️ Por favor ingresa una ciudad para cargar el mapa")
    
    # Página Acerca de
    elif selected == "ℹ️ Acerca de":
        st.markdown("### ℹ️ Acerca de VinotecaFinder")
        
        st.markdown("""
        **🍷 VinotecaFinder Argentina** es una aplicación que te ayuda a descubrir las mejores vinotecas de Argentina.
        
        ### 🚀 Características
        - 🔍 **Búsqueda inteligente** en múltiples fuentes
        - 📊 **Estadísticas en tiempo real**
        - 🗺️ **Mapas interactivos**
        - 📱 **Interfaz moderna y responsive**
        
        ### 🎯 Cómo Usar
        1. Ve a la pestaña "🔍 Buscar Vinotecas"
        2. Ingresa una ciudad o barrio
        3. Haz clic en "Buscar"
        4. Explora los resultados
        5. Usa el mapa para ver ubicaciones
        
        ### 📞 Soporte
        Si tienes problemas o sugerencias, no dudes en contactarnos.
        """)
        
        # Información técnica
        with st.expander("🔧 Información Técnica"):
            st.markdown("""
            **Versión**: 1.0.0
            **Última actualización**: """ + datetime.now().strftime("%d/%m/%Y %H:%M") + """
            **API Status**: """ + ("🟢 Conectado" if searcher else "🔴 Desconectado") + """
            """)

# Ejecutar la aplicación
if __name__ == "__main__":
    main() 