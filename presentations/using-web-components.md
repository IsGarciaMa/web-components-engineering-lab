---
marp: true
title: Using Web Components — Del consumo a la integración
lang: es
paginate: true
---

# Using Web Components

Capítulo 01 · Consumir, personalizar, integrar

La pregunta guía: **¿qué contrato ofrece esta etiqueta?**

---

## Un elemento no es una promesa de accesibilidad

- Custom Elements: identidad y comportamiento extensible.
- Shadow DOM: un límite de árbol y estilos.
- Slots: composición de contenido.
- Lit: templates y actualización sobre esas APIs.

Empieza por HTML nativo cuando resuelva el problema.

---

## De npm al navegador

```text
pnpm + lockfile → import del componente → registro
                                              ↓
consumidor ← evento con payload ← host configurado
```

Instalar un paquete no registra una etiqueta.

---

## Biblioteca real: Web Awesome 3.14.0

```ts
import '@awesome.me/webawesome/dist/components/button/button.js';
```

```html
<wa-button variant="brand">Confirmar</wa-button>
```

Importa el tema documentado. Revisa licencia, nombres y versiones.

---

## Atributo y propiedad

```ts
card.setAttribute('heading', 'Lectura de hoy'); // Cadena
card.reader = { name: 'Ada' }; // Objeto
card.compact = false; // Booleano
```

`compact="false"` sigue siendo presencia. No todas las propiedades reflejan.

---

## Un tema es un contrato de valores

```css
.reader-region {
  --reader-radius: 1rem;
}
lab-reading-card.local {
  --reader-radius: 0;
}
```

Las variables heredan por el host hacia Shadow DOM.
Cambia superficie y texto como una pareja accesible.

---

## Partes: exposición deliberada

```text
Consumidor → ::part(card-action) → frame
                                    ↓ exportparts
                            tarjeta → part="action"
```

```css
lab-card-frame::part(card-action) {
  border-style: dashed;
}
```

Una raíz abierta no convierte su implementación en API pública.

---

## Antes de registrar

```css
lab-deferred-note {
  display: block;
  min-block-size: 8rem;
}
lab-deferred-note:not(:defined) {
  border-style: dashed;
}
```

Conserva lectura y enlaces. El registro no se puede deshacer.
`whenDefined()` no espera el render asíncrono de Lit.

---

## Eventos hacia el consumidor

```ts
card.addEventListener('lesson-select', handleSelection);
```

- `detail`: datos del contrato.
- `bubbles`: recorrido por ancestros en burbujeo.
- `composed`: cruce de fronteras shadow.
- Desmontaje: retirar listeners externos.

Una escritura programática no debe fingir intención del usuario.

---

## React actual, sin restricciones históricas

React 19.3.1 reconoce propiedades presentes en la instancia.

```ts
createElement('lab-reading-card', {
  reader: { name: 'Ada' },
  'onlesson-select': handleSelection,
  ref: cardRef,
});
```

Registra antes de montar. Wrapper solo si aporta adaptación o una API propia.

---

## Angular, Vue y Astro

| Consumidor | Punto de integración                                 |
| ---------- | ---------------------------------------------------- |
| Angular    | schema + propiedad + evento; el schema no registra   |
| Vue        | isCustomElement + bindings; .prop cuando se necesita |
| Astro      | host en HTML + script de navegador                   |

No instales cuatro aplicaciones para demostrar el mismo contrato.

---

## CSR, SSR y SSG

```text
CSR: navegador + JavaScript → interfaz
SSR: petición → servidor → HTML
SSG: build → HTML estático → navegador
```

El HTML puede contener solo el host o contenido útil.
Describir cuál evita promesas falsas de SSR.

---

## HTML primero: mejora progresiva

1. Astro genera texto y enlaces.
2. El navegador los muestra sin JavaScript.
3. El registro habilita un control.
4. El elemento conserva los nodos existentes.

DSD crea una raíz al parsear HTML; no registra una clase ni hidrata Lit.

---

## Errores frecuentes

- Objetos serializados accidentalmente como atributos.
- Lectura antes de `updateComplete`.
- Eventos con nombre o propagación incorrectos.
- Ocultar contenido hasta un registro que puede fallar.
- Dos renderers modificando el mismo subárbol.

---

## Practicar y verificar

**Básico:** registro y atributos.
**Intermedio:** objeto, evento, token y limpieza.
**Avanzado:** integración e inicialización cliente.

Explica tu predicción antes de abrir la solución.

---

## Conclusiones

Consume la API pública. Personaliza lo expuesto.
Distingue HTML entregado de comportamiento registrado.
Prueba con teclado, sin JavaScript y en navegador real.

[Capítulo](/capitulos/01-using-web-components/)
· [Laboratorios](/laboratorios/using-web-components/)

---

## Referencias oficiales

- [WHATWG HTML](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [CSS Shadow](https://drafts.csswg.org/css-shadow-1/)
- [Web Awesome](https://webawesome.com/docs)
- [React DOM](https://react.dev/reference/react-dom/components)
- [Astro scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- [Lit SSR](https://lit.dev/docs/ssr/overview/)
