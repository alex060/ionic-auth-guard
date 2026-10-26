# Ionic Auth Guard & Granular Role Access Control

Práctica de laboratorio: **Control de Acceso y Protección de Rutas con Ionic, Angular Standalone y Functional Guards**.

## Características
- **Angular Standalone Components:** Sin módulos NgModule innecesarios.
- **Angular Signals:** `signal()` y `computed()` para gestión de estado en memoria reactivo.
- **Web Storage API:** Persistencia en `sessionStorage` con clave `DAM2_AUTH_SESSION`.
- **Functional Guards:** `authGuard` y factoría `roleGuard(allowedRole)` que retornan `UrlTree` atómico.
- **Control de Acceso Granular:**
  - `admin` / `123` -> Rol `'admin'` -> Acceso a `/admin`
  - `operador` / `123` -> Rol `'user'` -> Acceso a `/user-dashboard`
  - Bloqueo y redirección si `operador` intenta acceder a `/admin`.
- **Pruebas Automatizadas:** 15 tests unitarios con Vitest (`npm test -- --watch=false`).

## Comandos
```bash
# Iniciar app en navegador
ionic serve

# Compilar proyecto
npm run build

# Ejecutar tests
npm test -- --watch=false
```
