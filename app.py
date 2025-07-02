import streamlit as st

st.title("🍷 Test VinotecaFinder")
st.write("Si ves esto, Streamlit está funcionando correctamente.")

# Botón simple
if st.button("Haz clic aquí"):
    st.write("¡El botón funciona!")

# Input simple
nombre = st.text_input("Escribe tu nombre:")
if nombre:
    st.write(f"¡Hola {nombre}!")

# Datos simulados simples
vinotecas = [
    {"name": "Bodega La Rural", "address": "Mendoza", "rating": "4.5"},
    {"name": "Vinoteca Palermo", "address": "Palermo", "rating": "4.4"},
    {"name": "Wine Bar Recoleta", "address": "Recoleta", "rating": "4.6"}
]

st.write("### Vinotecas de ejemplo:")
for vinoteca in vinotecas:
    st.write(f"🍷 {vinoteca['name']} - {vinoteca['address']} - ⭐ {vinoteca['rating']}") 