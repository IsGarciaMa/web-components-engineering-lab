---
marp: true
title: Defining Web Components — Del contrato a la implementación
lang: es
paginate: true
---

# Defining Web Components

Capítulo 02 · Crear, conectar, componer y depurar

Pregunta guía: **¿qué responsabilidad pertenece a cada capa?**

---

## Un vocabulario de capas

- HTML: semántica y controles nativos.
- Custom Elements: definición y reacciones de una clase.
- Shadow DOM: árbol de implementación y límites de estilo.
- Slots: distribución del contenido del consumidor.
- Lit: templates y actualización reactiva sobre esas APIs.

No necesitas todas las capas en cada componente.

---

## Cuatro operaciones distintas

```text
Clase ──define──> Registro ──createElement──> Instancia
                     │                         │
                     └──upgrade──> Host         └──append──> Conexión
```

Un host puede estar conectado y sin definición.
Una instancia definida puede permanecer desconectada.

---

## Definición autónoma

```ts
class Note extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('lab-note', Note);
```

Nombre válido con guion. Constructor sin depender de atributos o hijos del host.

---

## Registro y upgrade

```ts
customElements.get('lab-note');
await customElements.whenDefined('lab-note');
customElements.upgrade(fragment);
```

`whenDefined` espera definición, no conexión ni render de Lit.
El upgrade conserva la identidad. No existe desregistro global.

---

## Shadow DOM: límite concreto

```text
Host
 ├─ Light DOM: contenido del consumidor
 └─ ShadowRoot: implementación
     ├─ estilos internos
     └─ slot ← asignación del contenido
```

`open`: expone `shadowRoot`. `closed`: devuelve `null` por esa API.
**Closed no es una frontera de seguridad.**

---

## Slots sin apropiarse del contenido

```html
<lab-slot-card>
  <span slot="title">Mi título</span>
  <p>Contenido</p>
</lab-slot-card>
```

El span sigue siendo hijo del host.
Fallback cuando no hay asignación. `slotchange` no observa toda mutación interna.

---

## Plantilla, copia e inserción

```text
template.content ──cloneNode(true)──> fragmento
                                          │ textContent
                                          ↓ append
                                    nodos en destino
```

No consumas la plantilla original.
No se copian listeners añadidos con `addEventListener`.
Clonar no garantiza mayor rendimiento en todo escenario.

---

## Lifecycle: reacciones, no guion lineal

```text
constructor → instancia
                ├─ cambiar atributo → attributeChangedCallback
                ├─ conectar → connectedCallback
                ├─ desconectar → disconnectedCallback
                └─ cambiar Document → adoptedCallback
```

Una instancia puede reconectarse muchas veces.
Los atributos pueden cambiar estando desconectada.

---

## Experimento con recursos

1. Crear la sonda sin conectar.
2. Conectar y emitir señal: suma uno.
3. Desconectar y emitir señal: no suma.
4. Reconectar y emitir: vuelve a sumar uno.

Si suma dos, investiga listeners duplicados.
El historial registra solo callbacks reales, máximo 20 entradas.

---

## Movimientos y adopción

- `append`: un movimiento clásico puede desconectar y reconectar.
- `moveBefore` con `connectedMoveCallback`: preservación cuando hay soporte.
- `adoptNode`: cambia `ownerDocument`; no conecta por sí mismo.

Detecta capacidades y conserva la alternativa clásica.
Un documento inerte puede no tener `defaultView`.

---

## Observed Attributes

```ts
static observedAttributes = ['value'];
attributeChangedCallback(name, oldValue, newValue) {
  // Convertir y actualizar solo lo necesario.
}
```

Valores cadena o `null`. Reacciones iniciales durante upgrade.
La mutación interna también puede generar callback.

---

## Contrato sin ciclos

```text
setter → serializa solo si difiere → atributo → callback → vista
```

`value="250"` puede interpretarse como 100 sin reescribir el texto externo.
Asignar `value = 250` serializa 100 según este contrato.
`muted="false"` sigue siendo presencia verdadera.

---

## Styling como API pública

```css
:host {
  color: var(--meter-accent, inherit);
}
:host([muted]) {
  border-style: dashed;
}
```

El consumidor configura un token; la raíz decide cómo usarlo.
Hojas construibles: compartir estilos exige considerar documento y soporte.
No añadas `unsafeCSS` con entradas externas.

---

## Native vs Lit

| Responsabilidad         | Nativo               | Lit                  |
| ----------------------- | -------------------- | -------------------- |
| Nodos                   | Creación explícita   | Template `html`      |
| Datos                   | Getter/setter manual | Propiedad reactiva   |
| Actualización           | Manual               | Agrupada y asíncrona |
| Dominio y accesibilidad | Autor                | Autor                |

Lit conserva el lifecycle nativo y añade un sistema de actualización.

---

## Customized built-ins: opción condicionada

```ts
class Confirm extends HTMLButtonElement {}
customElements.define('lab-confirm', Confirm, { extends: 'button' });
```

```html
<button is="lab-confirm" type="button">Confirmar</button>
```

Soporte desigual; Safari no lo soporta según la documentación consultada.
Alternativa: botón nativo con listener o autónomo compuesto.

---

## Depurar por fronteras

```text
Definición → Instancia → Conexión → Árbol → Entrada → Recursos
```

- Slot `heading` frente al contrato `title`: inspecciona asignación.
- `NotSupportedError`: revisa registro duplicado.
- Efectos duplicados: reproduce reconexión con contador.
- Lit: espera `updateComplete` antes de medir su resultado.

---

## Práctica y conclusiones

1. Básico: medidor con conversión explícita.
2. Intermedio: tarjeta con slots y fallback.
3. Avanzado: sonda con limpieza y reconexión.

Crea contratos observables. Respeta la propiedad de los nodos.
Prueba operaciones reales; no simules callbacks como evidencia.

---

## Referencias y material

- [HTML: Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [DOM: árboles y operaciones](https://dom.spec.whatwg.org/)
- [MDN: moveBefore y soporte](https://developer.mozilla.org/en-US/docs/Web/API/Element/moveBefore)
- [Lit: lifecycle](https://lit.dev/docs/components/lifecycle/)
- [Capítulo y laboratorios](../capitulos/02-defining-web-components/)

Contenido y experimentos originales del laboratorio.
