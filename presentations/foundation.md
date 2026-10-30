---
marp: true
title: Web Components Engineering Lab — Infraestructura
lang: es
paginate: true
---

# Web Components Engineering Lab

PR-00 · Estándares, claridad y contratos verificables

---

## De una API a dos implementaciones

- Custom Elements nativos: lifecycle y DOM explícitos.
- LitElement: templates y actualización reactiva.
- Mismo contrato: `count` y `count-change`.

---

## Antes de publicar

Formato → lint → tipos → unit tests → build → E2E.

Los resultados deben proceder de comandos ejecutados.

Los once capítulos se desarrollarán en PR independientes.
