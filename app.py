# Nueva aplicación Streamlit - Sin cache
import streamlit as st

st.set_page_config(
    page_title="🍷 VinotecaFinder Argentina",
    page_icon="🍷",
    layout="wide"
)

st.title("🍷 VinotecaFinder Argentina")
st.write("### Aplicación de búsqueda de vinotecas en Argentina")

# Datos simulados de vinotecas
vinotecas_data = {
    "mendoza": [
        {"name": "Bodega La Rural", "address": "Av. San Martín 2724, Mendoza", "rating": "4.5"},
        {"name": "Vinoteca Mendoza", "address": "Belgrano 1194, Mendoza", "rating": "4.3"},
        {"name": "Wine Store Mendoza", "address": "Sarmiento 123, Mendoza", "rating": "4.7"}
    ],
    "córdoba": [
        {"name": "Vinoteca Córdoba", "address": "Av. Hipólito Yrigoyen 123, Córdoba", "rating": "4.3"},
        {"name": "Wine Bar Córdoba", "address": "San Martín 456, Córdoba", "rating": "4.5"},
        {"name": "Bodega Córdoba", "address": "Belgrano 789, Córdoba", "rating": "4.2"}
    ],
    "palermo": [
        {"name": "Vinoteca Palermo", "address": "Av. Santa Fe 1234, Palermo", "rating": "4.4"},
        {"name": "Wine Bar Palermo", "address": "Gorriti 567, Palermo", "rating": "4.6"},
        {"name": "Bodega Palermo", "address": "Honduras 890, Palermo", "rating": "4.3"}
    ]
}

# Interfaz de búsqueda
st.write("### 🔍 Buscar Vinotecas")
location = st.text_input("📍 Ubicación", placeholder="Ej: Mendoza, Córdoba, Palermo...")

# Botones de ubicaciones populares
st.write("### 📍 Ubicaciones Populares")
col1, col2, col3 = st.columns(3)

with col1:
    if st.button("🍷 Mendoza"):
        location = "mendoza"

with col2:
    if st.button("🏛️ Córdoba"):
        location = "córdoba"

with col3:
    if st.button("🌳 Palermo"):
        location = "palermo"

# Realizar búsqueda
if location:
    st.write(f"### 🔍 Buscando vinotecas en: {location.title()}")
    
    # Buscar en datos simulados
    location_lower = location.lower()
    if location_lower in vinotecas_data:
        vinotecas = vinotecas_data[location_lower]
        st.success(f"✅ Se encontraron {len(vinotecas)} vinotecas en {location.title()}")
        
        # Mostrar resultados
        for i, vinoteca in enumerate(vinotecas):
            with st.container():
                st.markdown(f"""
                **🍷 {vinoteca['name']}**  
                📍 {vinoteca['address']}  
                ⭐ {vinoteca['rating']}
                """)
                st.divider()
    else:
        st.warning(f"⚠️ No se encontraron vinotecas específicas para {location}")
        st.info("💡 Prueba con: Mendoza, Córdoba, o Palermo")

# Información adicional
st.write("---")
st.write("### ℹ️ Acerca de")
st.write("Esta aplicación te ayuda a encontrar vinotecas en diferentes ciudades de Argentina.")
st.write("**Desarrollado con Streamlit** 🚀") 