# Links Project React

Este proyecto es una aplicación web construida con React y Vite para gestionar, visualizar y personalizar colecciones de enlaces (links) en escritorios virtuales. Incluye autenticación, integración con Firebase, y una interfaz moderna y personalizable.

## Características principales
- Gestión de escritorios y columnas de enlaces
- Autenticación de usuario (Google/Firebase)
- Visualización de detalles de enlaces
- Búsqueda y filtrado de enlaces
- Personalización de la interfaz (temas, paneles, scrollbars)
- Notificaciones con React Toastify
- Scroll personalizado con OverlayScrollbars
- Soporte para imágenes y videos

## Estructura del proyecto
- `src/` — Código fuente principal
  - `components/` — Componentes reutilizables y páginas
  - `hooks/` — Custom hooks
  - `services/` — Lógica de servicios y utilidades
  - `store/` — Estado global (Zustand)
  - `config/` — Configuración de Firebase
- `public/` — Recursos estáticos (imágenes, fuentes)
- `index.html` — HTML principal
- `vite.config.js` — Configuración de Vite

## Instalación
1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd links-project-react
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` si es necesario (por ejemplo, claves de Firebase).
4. Inicia la aplicación en modo desarrollo:
   ```sh
   npm run dev
   ```

## Scripts útiles
- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Genera la build de producción
- `npm run preview` — Previsualiza la build

## Dependencias principales
- React
- React Router DOM
- Zustand
- Firebase
- OverlayScrollbars
- React Toastify
- Vite

## Licencia
MIT

---

> Proyecto desarrollado por Sergio Sánchez.
