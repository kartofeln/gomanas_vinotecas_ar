#!/usr/bin/env python3
"""
Script de verificación para el deploy de VinotecaFinder Argentina
Verifica que todas las dependencias y configuraciones estén correctas
"""

import sys
import os
import importlib
from pathlib import Path

def check_python_version():
    """Verificar versión de Python"""
    print("🐍 Verificando versión de Python...")
    version = sys.version_info
    print(f"   Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major == 3 and version.minor >= 11:
        print("   ✅ Versión de Python compatible")
        return True
    else:
        print("   ❌ Se requiere Python 3.11 o superior")
        return False

def check_required_packages():
    """Verificar paquetes requeridos"""
    print("\n📦 Verificando paquetes requeridos...")
    
    required_packages = [
        'streamlit',
        'requests', 
        'beautifulsoup4',
        'pandas',
        'plotly',
        'folium',
        'streamlit_option_menu',
        'streamlit_extras',
        'streamlit_folium'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - NO INSTALADO")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Paquetes faltantes: {', '.join(missing_packages)}")
        print("   Ejecuta: pip install -r requirements.txt")
        return False
    
    return True

def check_files():
    """Verificar archivos necesarios"""
    print("\n📁 Verificando archivos necesarios...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'runtime.txt',
        '.streamlit/config.toml',
        'packages.txt'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - NO ENCONTRADO")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n⚠️  Archivos faltantes: {', '.join(missing_files)}")
        return False
    
    return True

def check_env_variables():
    """Verificar variables de entorno"""
    print("\n🔧 Verificando variables de entorno...")
    
    required_vars = ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD']
    missing_vars = []
    
    for var in required_vars:
        if os.getenv(var):
            print(f"   ✅ {var} configurada")
        else:
            print(f"   ❌ {var} - NO CONFIGURADA")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️  Variables faltantes: {', '.join(missing_vars)}")
        print("   Configura estas variables en Streamlit Cloud")
        return False
    
    return True

def check_app_import():
    """Verificar que la aplicación se puede importar"""
    print("\n🚀 Verificando importación de la aplicación...")
    
    try:
        # Intentar importar la aplicación
        import app
        print("   ✅ app.py se puede importar correctamente")
        return True
    except Exception as e:
        print(f"   ❌ Error al importar app.py: {e}")
        return False

def main():
    """Función principal de verificación"""
    print("🍷 Verificación de Deploy - VinotecaFinder Argentina")
    print("=" * 60)
    
    checks = [
        check_python_version(),
        check_required_packages(),
        check_files(),
        check_app_import()
    ]
    
    # Solo verificar variables de entorno si estamos en producción
    if os.getenv('STREAMLIT_SERVER_ADDRESS'):
        checks.append(check_env_variables())
    
    print("\n" + "=" * 60)
    
    if all(checks):
        print("🎉 ¡Todo está listo para el deploy!")
        print("\n📋 Próximos pasos:")
        print("   1. Sube los cambios a GitHub")
        print("   2. Configura las variables de entorno en Streamlit Cloud")
        print("   3. Haz deploy en Streamlit Cloud")
        print("   4. ¡Disfruta tu aplicación!")
    else:
        print("❌ Hay problemas que necesitan ser solucionados antes del deploy")
        print("\n🔧 Soluciones:")
        print("   - Instala dependencias faltantes: pip install -r requirements.txt")
        print("   - Verifica que todos los archivos estén presentes")
        print("   - Configura las variables de entorno")
        print("   - Usa Python 3.11 en Streamlit Cloud")
    
    return all(checks)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 