# Clase 1 - Introducción a Python y Machine Learning

Este documento corresponde a la **Clase 1** de un curso de Python y Machine Learning.  
Contiene los conceptos básicos sobre el lenguaje Python, sus características principales, aplicaciones y una primera introducción al aprendizaje automático.

---

## Contenido

### 1. ¿Qué es Python?  
- **Características principales**:
  - Manejo robusto de errores
  - Tipado fuerte y dinámico
  - Lenguaje interpretado
  - Multiparadigma (imperativo, funcional y orientado a objetos)
  - Muy legible (verboso)
  - Gran comunidad
  - Multiplataforma  

- **Versiones e implementaciones**:
  - CPython
  - MicroPython
  - Jython
  - Brython

- **Multiparadigma**:
  - Imperativo
  - Funcional
  - Orientado a objetos  

- **Módulos estándar destacados**:
  - `math`, `statistics`, `random`
  - `os`, `os.path`, `platform`
  - `string`, `re`
  - `collections`, `datetime`, `calendar`
  - Manejo de archivos: `fileinput`, `gzip`, `zipfile`, `csv`, `configparser`
  - Entrada/salida: `io`, `readline`

- **Áreas de aplicación de Python**:
  - Ciencia de datos y análisis
  - Machine Learning
  - Desarrollo web
  - Automatización
  - Procesamiento de texto y datos
  - Manejo de archivos y sistemas operativos  

- **Pregunta de reflexión**: ¿Vale la pena programar en 2025?  
  - Se menciona la recuperación en la contratación de graduados en tecnología.

---

### 2. Introducción a Machine Learning
- **Definición**:  
  El aprendizaje automático se basa en procedimientos computacionales que aprenden una tarea a partir de datos.
- **Conceptos clave**:  
  - Datos → Algoritmos → Predicción  
  - Modelo → Predicción  
- Se presenta un esquema visual de la relación entre datos, modelos y predicciones.

---

### 3. Clean Code

Escribir código limpio es una de las habilidades más importantes de un programador, ya que facilita la lectura, mantenimiento y colaboración en proyectos de software.  
Algunos principios básicos que aplicaremos en Python son:

- Nombres descriptivos y legibles  
  Usa snake_case para variables y funciones (ejemplo: calcular_promedio), y CamelCase para clases (ejemplo: ModeloLineal).  

- Funciones cortas y con un único propósito  
  Una función debe realizar una tarea clara. Ejemplo:

  def calcular_promedio(lista):
      return sum(lista) / len(lista)

- Evitar comentarios innecesarios  
  El código debe ser lo suficientemente claro para explicarse solo.  

  - Bien:
    ```python
    def obtener_usuario_por_id(id_usuario):
        ...
    ```

  - Mal:
    ```python
    # Esta función obtiene un usuario por su id
    def funcion1(x):
        ...
    ```

- Consistencia en el estilo  
  Seguir la guía oficial de Python PEP 8 asegura uniformidad.  

- Manejo adecuado de errores  
  Usar try/except de manera explícita y clara.

  ```python
    try:
        archivo = open("datos.txt")
    except FileNotFoundError:
        print("El archivo no existe.")
  ```

- Principios clave de Clean Code:  
  - KISS: Keep It Simple, Stupid → Mantén el código lo más simple posible.  
  - DRY: Don’t Repeat Yourself → Evita duplicar lógica.  
  - YAGNI: You Aren’t Gonna Need It → No programes cosas que no necesitas aún.  


### 4. Tareas asignadas
- Repaso de **tipos de datos en Python**
- Instalación de **Python 3**
- Ejercicios prácticos de programación
- **Proyecto final:** Predictor de números

---

## Resumen
El archivo es una **guía introductoria** que combina los fundamentos del lenguaje Python con una primera aproximación al Machine Learning. Está pensado para estudiantes que inician en la programación y desean comprender tanto las bases del lenguaje como su relevancia en áreas actuales como ciencia de datos y la inteligencia artificial.

