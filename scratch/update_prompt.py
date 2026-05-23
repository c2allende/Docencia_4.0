
import re

file_path = r'c:\Users\Carmelo Allende\.antigravity\Docencia_4.0\docencia-4.0\leccion2_1.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Regular expression to find the prompt-template div and its content
# We use a pattern that is flexible with whitespace but specific enough
pattern = re.compile(r'(<div class="prompt-template">)(.*?)(</div>)', re.DOTALL)

new_text = """
                    <span class="prompt-token prompt-token--role">[Rol]</span>
                    Actúa como un <span class="prompt-token prompt-token--highlight">Maestro de Ciencias de Nivel Elemental en Puerto Rico</span>, experto en currículo basado en los <span class="prompt-token prompt-token--highlight">Estándares y Expectativas del Departamento de Educación de Puerto Rico (DEPR)</span>.
                    
                    <span class="prompt-token prompt-token--context">[Contexto de la Clase]</span>
                    <span class="prompt-token prompt-token--highlight">Grado: 5to grado</span> (Estudiantes de 10-11 años). Tema: <span class="prompt-token prompt-token--highlight">Ecosistemas de Puerto Rico</span> (Interacciones entre factores bióticos y abióticos). Duración: <span class="prompt-token prompt-token--highlight">45 minutos</span>. Audiencia: Grupo heterogéneo (requiere estrategias de diferenciación).
                    
                    <span class="prompt-token prompt-token--task">[Tarea]</span>
                    Diseña un plan de clase diario que cumpla con los estándares del DEPR. Debes integrar ejemplos específicos de nuestra isla, como el Bosque Nacional El Yunque (bosque pluvial), el Bosque Seco de Guánica o los manglares de nuestras costas.
                    
                    <span class="prompt-token prompt-token--format">[Formato]</span> <span class="prompt-token prompt-token--requirements">[Requisitos de la Estructura (Tabla)]</span>
                    Presenta el plan en una tabla con las siguientes columnas: Fase (Inicio, Desarrollo, Cierre), Tiempo (Distribución de los 45 min), Actividad (Descripción paso a paso con lenguaje accesible) y <span class="prompt-token prompt-token--highlight">Estrategia DUA/Diferenciación</span> (Cómo adaptarás la actividad para diferentes niveles de habilidad).
                    
                    <span class="prompt-token prompt-token--sections">[Secciones Adicionales Requeridas]</span>
                    Al finalizar la tabla, incluye brevemente: Estándar y Expectativa (Código y descripción oficial del DEPR para 5to grado), Materiales sugeridos (Lista de recursos necesarios) y Avalúo/Assessment (Una actividad rápida para verificar el aprendizaje, por ejemplo, boleto de salida o diagrama rápido).
                    
                    <span class="prompt-token prompt-token--tone">[Restricciones de Tono]</span>
                    Usa un tono inspirador y pedagógico. Asegúrate de que los ejemplos promuevan el <span class="prompt-token prompt-token--highlight">sentido de pertenencia y la conservación ambiental en Puerto Rico</span>.
                """

def replacement(match):
    return match.group(1) + new_text + match.group(3)

# We want to replace only the FIRST occurrence (the one in toolbox-card)
# The second occurrence is in "Example of few-shot" but the pattern might match it too.
# Let's see how many occurrences there are.
matches = list(pattern.finditer(content))
print(f"Found {len(matches)} matches.")

if len(matches) >= 1:
    # Replace only the first one
    new_content = content[:matches[0].start()] + matches[0].group(1) + new_text + matches[0].group(3) + content[matches[0].end():]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replacement successful.")
else:
    print("No match found.")
