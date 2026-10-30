# Entorno de PR-00

Revisión final del 30 de octubre de 2026:

| Herramienta | Observado            |
| ----------- | -------------------- |
| Sistema     | macOS 12.7.6, x86_64 |
| Node        | 24.22.1              |
| pnpm        | 10.34.9              |
| Git         | 2.56.0               |

El repositorio existe y su rama no nacida es `chore/00-foundation`: todavía no tiene commits ni remotos. Los archivos de entrega están sin seguimiento. No se creó ninguna rama ni se hizo commit, push o despliegue durante la revisión. `.git` y `.agents` permanecen protegidos por el sandbox; las diez Skills ya están instaladas y reconocidas, como explica [su estado](skills.md).

`pnpm-lock.yaml` existe y `pnpm install --frozen-lockfile` pasa con las versiones declaradas. Los scripts usan dependencias locales y rechazan herramientas ausentes o de otra versión. La instalación limpia y las puertas de calidad se registran en [validación](validation.md).

El sandbox no resuelve `registry.npmjs.org` para la auditoría (`ENOTFOUND`). Repetir `pnpm audit --json` y `pnpm audit --prod --json` con elevación permitió consultar el registro: hay avisos reales en tooling, documentados en [seguridad](security.md); producción devuelve cero avisos.

## Navegadores y entorno compatible

La instalación normal de Playwright falla al crear su caché en el directorio de usuario (`EPERM`). La repetición con elevación falla con `Playwright does not support chromium on mac12`. No se rebajan versiones ni se sustituye el navegador para simular soporte. Docker está instalado, pero no hay daemon disponible en `/var/run/docker.sock`.

El Node instalado se ejecuta en Monterey; eso no demuestra soporte oficial del conjunto. Para cerrar E2E usa Ubuntu 24.04, como la CI preparada, o un sistema soportado por la versión fijada de Playwright:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm check
```

No se ha ejecutado CI remota ni probado Apple Silicon. `.gitignore` excluye dependencias, cachés, builds, capturas/reportes, presentaciones generadas, `.env*`, credenciales AWS, logs y `.tsbuildinfo`. No ignores ni regeneres el lockfile para superar una instalación congelada fallida.
