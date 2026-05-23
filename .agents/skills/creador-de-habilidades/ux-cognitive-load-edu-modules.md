{
  "id": "ux_cognitive_load_edu_modules_v1",
  "name": "UX & Cognitive Load for LMS Modules",
  "version": "1.0.0",
  "scope": ["lms.lesson", "lms.activity", "lms.forum", "web.page"],
  "description": "Guía de diseño para reducir carga cognitiva y mejorar escaneo de contenido educativo largo en LMS y páginas web.",
  "principles": [
    "Priorizar escaneo sobre lectura completa.",
    "Aplicar chunking de información (una idea por bloque).",
    "Usar jerarquía visual clara: título > subtítulo > resumen > cuerpo > apoyo.",
    "Usar resaltado selectivo (negritas, color, callouts) sin saturación.",
    "Aplicar divulgación progresiva: primero lo esencial, detalles en capas."
  ],

  "layout_policies": {
    "max_words_per_screen": 400,
    "max_paragraph_lines": 5,
    "max_concepts_per_screen": 1,
    "required_sections_per_lesson_screen": [
      "heading",
      "key_message",
      "main_content"
    ],
    "optional_sections_per_lesson_screen": [
      "micro_activity",
      "summary",
      "next_action"
    ],
    "section_roles": {
      "lesson": "primary_information_processing",
      "activity": "guided_practice_and_check",
      "resources": "optional_extension",
      "forum": "reflection_and_transfer"
    }
  },

  "text_structure_rules": {
    "pyramid_inverted": true,
    "pyramid_inverted_hint": "El primer párrafo debe contener la idea clave / conclusión de la sección.",
    "paragraph": {
      "max_characters": 450,
      "single_topic_per_paragraph": true
    },
    "headings": {
      "require_informative_labels": true,
      "examples_good": [
        "Pasos del proceso",
        "Errores frecuentes",
        "Aplicación en el aula",
        "Implicaciones éticas"
      ],
      "examples_bad": [
        "Introducción",
        "Más información",
        "Otros"
      ]
    },
    "lists": {
      "encourage_for": [
        "secuencias_de_pasos",
        "criterios",
        "beneficios",
        "desafios"
      ],
      "require_keyword_first": true,
      "keyword_format_hint": "Palabra clave + dos puntos + explicación breve. Ej: 'Precaución: ...'"
    },
    "tables": {
      "encourage_when_comparing": true,
      "comparison_examples": [
        "tres enfoques",
        "tipos de recurso",
        "fases del proceso"
      ]
    }
  },

  "highlighting_rules": {
    "bold": {
      "max_percentage_of_visible_text": 0.15,
      "allowed_scope": [
        "terminos_clave",
        "frases_de_takeaway",
        "acciones_criticas"
      ],
      "forbidden_scope": [
        "parrafos_completos",
        "textos_mayores_a_una_linea"
      ]
    },
    "color": {
      "accent_primary_role": "contenido_critico",
      "accent_secondary_role": "contenido_opcional_o_de_apoyo",
      "max_accent_colors_per_screen": 2
    },
    "callouts": {
      "allowed_types": [
        "definicion_clave",
        "recuerda",
        "cuidado",
        "ejemplo_real",
        "idea_central"
      ],
      "max_callouts_per_screen": 3
    }
  },

  "chunking_and_layers": {
    "chunking": {
      "enabled": true,
      "rules": [
        "una_idea_principal_por_pantalla",
        "subdividir_bloques_texto_largos_en_subsecciones"
      ]
    },
    "progressive_disclosure": {
      "enabled": true,
      "patterns": [
        "accordions",
        "tabs",
        "leer_mas_links"
      ],
      "usage_guidelines": [
        "mostrar_siempre_resumen_y_accion_principal_en_la_capa_visible",
        "mover_citas_largas_y_detalle_tecnico_a_capas_colapsables"
      ]
    }
  },

  "ui_patterns": {
    "summary_plus_detail": {
      "recommended_for": ["lesson_intro", "long_article"],
      "structure": ["summary_block", "detail_sections"],
      "summary_block_constraints": {
        "max_lines": 4,
        "must_answer": ["que", "para_que"]
      }
    },
    "toc_fixed": {
      "recommended_for": ["long_lesson", "module_overview"],
      "requirements": {
        "min_sections_to_enable": 4,
        "link_to_headings": true
      }
    },
    "accordions": {
      "recommended_for": ["faq", "normas", "contenido_secundario"],
      "default_state": "collapsed"
    },
    "callout_blocks": {
      "recommended_for": ["alertas", "conclusiones", "definiciones"],
      "style_hint": "color_suave + icono_simple + texto_breve"
    },
    "keyword_first_lists": {
      "recommended_for": ["instrucciones", "rubricas", "criterios"],
      "pattern": "KEYWORD: explanation"
    }
  },

  "lms_specific": {
    "lesson_template": {
      "sections_order": [
        "title",
        "why_it_matters",
        "objectives",
        "content_blocks",
        "micro_activity",
        "summary",
        "next_action"
      ],
      "why_it_matters": {
        "max_lines": 4,
        "style": "short_paragraph"
      },
      "objectives": {
        "format": "bullets",
        "max_items": 4,
        "language": "estudiante"
      },
      "content_blocks": {
        "max_blocks_per_lesson": 4,
        "one_focus_per_block": true
      },
      "micro_activity": {
        "required": true,
        "examples": [
          "3_preguntas_opcion_multiple",
          "1_pregunta_reflexion_corta",
          "ejercicio_simple_de_aplicacion"
        ]
      },
      "summary": {
        "required": true,
        "format": "lista_takeaways",
        "max_items": 5
      },
      "next_action": {
        "required": true,
        "must_include": ["que_hacer_ahora", "a_donde_ir_en_el_LMS"]
      }
    },

    "module_structure_roles": {
      "lessons": "explicar_conceptos_y_mostrar_ejemplos",
      "activities": "practica_guiada_y_productos_pequenos",
      "resources": "lecturas_y_materiales_de_profundizacion",
      "forum": "organizar_ideas_y_reflexionar_sobre_la_experiencia"
    },

    "forum_prompts": {
      "required_elements": [
        "pregunta_central",
        "estructura_respuesta",
        "minimo_de_interacciones"
      ],
      "example_structure": [
        "reto_y_solucion",
        "viabilidad",
        "precaucion",
        "reflexion_cierre"
      ]
    }
  },

  "validation_checklist": {
    "screen_level": [
      "Tiene_titulo_claro",
      "Incluye_parrafo_inicial_con_idea_clave",
      "No_supera_max_words_per_screen",
      "No_hay_mas_de_una_idea_principal",
      "Hay_subtitulos_informativos_si_el_texto_es_largo",
      "Uso_de_negritas_por_debajo_del_limite",
      "Hay_al_menos_un_patron_UI_recomendado_en_uso",
      "Usuario_sabe_que_hacer_despues"
    ],
    "lesson_level": [
      "Incluye_seccion_why_it_matters",
      "Objetivos_en_formato_lista_y_lenguaje_claro",
      "Contenido_dividido_en_bloques_con_un_foco",
      "Microactividad_presente_y_relacionada_con_la_leccion",
      "Resumen_con_takeaways_presentes",
      "Next_action_claro_y_conectado_con_actividad_o_forum"
    ],
    "module_level": [
      "Cada_leccion_tiene_un_objetivo_principal",
      "Hay_equilibrio_entre_lecciones_actividades_recursos_foro",
      "Los_recursos_largos_estan_fuera_de_las_pantallas_principales",
      "El_forum_esta_conectado_con_los_objetivos_del_modulo"
    ]
  }
}