---
marp: true
title: Working with the DOM — Contratos y Tabs accesibles
lang: es
paginate: true
---

# Working with the DOM

Capítulo 03 · Atributos, propiedades, eventos y selección

Proyecto conductor: **Tabs nativo y Lit con el mismo contrato**.

---

## Diseña el contrato primero

- `items`: metadatos con IDs estables; propiedad, sin atributo JSON.
- `selected`: ID, con normalización y reflexión.
- `disabled`: presencia booleana para interacción con tabs.
- `label`: nombre accesible del grupo.
- Slots: contenido propiedad del consumidor.
- Intención cancelable y cambio confirmado: eventos diferentes.

---

## Host DOM

```text
Host HTMLElement
 ├─ section slot="intro" ← consumidor
 └─ ShadowRoot
     ├─ botón role="tab"
     └─ div role="tabpanel"
         └─ slot name="intro" ← asignación, no traslado
```

`this.querySelector()` y `shadowRoot.querySelector()` consultan árboles distintos.

---

## Propiedad de los nodos

| Autor       | Responsabilidad                        |
| ----------- | -------------------------------------- |
| Consumidor  | Nodos Light DOM y entradas de API      |
| Tabs nativo | Nodos internos y sincronización manual |
| Tabs Lit    | Template interno y bindings reactivos  |

No modifiques nodos de otro renderer para saltarte su contrato.

---

## Attributes

```ts
tabs.setAttribute('selected', 'contract');
tabs.getAttribute('selected');
tabs.removeAttribute('selected');
tabs.hasAttribute('disabled');
tabs.toggleAttribute('disabled', false);
```

Texto o ausencia. `disabled="false"` sigue siendo presencia verdadera.

---

## Un reflector sin ciclos

```text
atributo → callback → normalizar ID → estado/vista
                         └─ escribir solo si difiere
```

Eliminar selected pide el valor por defecto: primera pestaña habilitada.
Sin opciones habilitadas, selección vacía y mensaje explícito.

---

## Properties

```ts
tabs.items = [
  { id: 'intro', label: 'Introducción' },
  { id: 'contract', label: 'Contrato' },
];
tabs.selected = 'contract';
```

Asignar una propiedad de HTMLElement no actualiza UI por magia.
Nuestro setter valida y aplica el contrato.

---

## Datos ricos y tipos

- Array nuevo al cambiar metadatos.
- Copia defensiva de primitivas; IDs únicos.
- `selected` público, ID enfocado privado.
- TypeScript describe contratos; valida entradas en ejecución.

Una propiedad temprana puede ocultar un accessor después del upgrade.
La versión nativa recupera esos valores al conectar.

---

## EventTarget y CustomEvent

```ts
const accepted = host.dispatchEvent(
  new CustomEvent('before-tab-change', {
    detail: { previous: 'intro', selected: 'contract', source: 'keyboard' },
    bubbles: true,
    composed: true,
    cancelable: true,
  }),
);
```

Payload mínimo: IDs y origen; no referencias a botones privados.

---

## Propagación

```text
captura → host → raíz → emisor → burbujeo según flags
```

- `target`: destino visto desde el contexto, con retargeting.
- `currentTarget`: destino del listener en ejecución.
- `composedPath()`: recorrido expuesto durante dispatch.

Un evento no burbujeante puede observarse en captura.
`composed` controla el cruce shadow según las reglas de dispatch.

---

## Cancelar no detiene propagación

`preventDefault()` solicita cancelación si `cancelable` es true.
`dispatchEvent()` devuelve false cuando se canceló.

`stopPropagation()` modifica el recorrido de listeners.

La intención se cancela síncronamente; una promesa tardía no retrocede el dispatch.

---

## Tabs: foco y selección

```text
Flechas / Home / End → mover foco
Enter / Espacio / clic → intención → selección aceptada → tab-change
Propiedad selected → estado normalizado, sin notificación de usuario
```

Activación **manual** explícita. Evita activar contenido por explorar opciones.

---

## Relaciones accesibles

```text
tablist con nombre
 └─ tab: aria-selected, tabindex, aria-controls
                                  ↓
     tabpanel: aria-labelledby ← ID del tab
```

Los IDs ARIA se resuelven dentro de la misma raíz.
Los slots proyectan contenido dentro del contenedor de panel.

---

## Teclado

- Flechas horizontales: siguiente/anterior habilitada, con vuelta.
- RTL: dirección visual invertida.
- Home y End: extremos.
- Enter y Espacio: activar una vez.
- Tab: salir hacia panel y resto de la página.

Una sola pestaña habilitada con tabindex 0.
No interceptes las flechas verticales para una lista horizontal.

---

## Sincronizar dos vistas

```text
Usuario en A → tab-change → consumidor → B.selected = id
                                              └─ silencioso
```

El puente puede funcionar en ambas direcciones sin bucles.
No inventes otro evento de usuario por recibir una propiedad.

---

## Terminar el componente

- Sin tabs o todos deshabilitados: estado vacío explícito.
- Cambios dinámicos: reconciliación por ID.
- Selección retirada: primera habilitada.
- Foco perdido u ocultado: recuperar dentro del widget.
- Foco exterior: conservarlo.
- Desconectar/reconectar: no duplicar handlers.

---

## Native vs Lit

| Aspecto                | Nativo                   | Lit                    |
| ---------------------- | ------------------------ | ---------------------- |
| Observación            | observedAttributes       | @property              |
| UI                     | Creación y mapa de nodos | html y repeat por ID   |
| Momento                | Sincronización manual    | Actualización agrupada |
| Lectura tras cambiar   | Según API síncrona       | await updateComplete   |
| Dominio, eventos, ARIA | Autor                    | Autor                  |

---

## Registros globales y locales

```text
window.customElements → nombres globales
registro A → raíz A → lab-scoped-note clase A
registro B → raíz B → lab-scoped-note clase B
```

Detecta capacidad y verifica ámbito e instancia.
Soporte limitado: la demo local es opcional; Tabs conserva el registro global.

---

## Depurar con evidencia

1. Comprueba definición e instancia.
2. Consulta el árbol correcto.
3. Compara atributo y propiedad.
4. Registra el evento dentro del listener.
5. Separa foco, selección y visibilidad.
6. Repite conexión para detectar handlers duplicados.

No uses una pausa arbitraria como señal de preparación.

---

## Práctica

- Básico: controlar entradas DOM sin eventos ficticios.
- Intermedio: payload, recorrido, cancelación y limpieza.
- Avanzado: Tabs accesibles y sincronización externa.

Pruebas de contrato rápidas durante desarrollo.
Navegador, axe y responsive en CI compatible.

---

## Referencias y conclusiones

- [DOM: eventos y árboles](https://dom.spec.whatwg.org/)
- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Lit: propiedades](https://lit.dev/docs/components/properties/)
- [MDN: scoped registries](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/customElementRegistry)
- [Capítulo y prácticas](../capitulos/03-working-with-dom/)

Contratos explícitos, propiedad de nodos y comportamiento verificable.
