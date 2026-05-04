# Proyecto Chicolino

Proyecto web con SVG a pantalla completa utilizando Tailwind CSS.

## Instalación

```bash
npm install
```

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Compila el CSS de Tailwind y queda observando cambios en tiempo real.

### Build de producción

```bash
npm run build
```

Compila el CSS de Tailwind una sola vez para producción.

### Build con observador

```bash
npm run build-css
```

Similar a `npm run dev`, compila y observa cambios.

## Estructura del proyecto

```
chicolino/
├── src/
│   └── styles.css          # CSS fuente con directivas de Tailwind
├── dist/
│   └── styles.css          # CSS compilado (generado automáticamente)
├── index.html              # Página principal
├── tailwind.config.js      # Configuración de Tailwind CSS
├── postcss.config.js       # Configuración de PostCSS
└── package.json            # Configuración del proyecto
```

## Personalización

### Modificar estilos

Edita `src/styles.css` para agregar tus propios estilos personalizados.

### Configurar Tailwind

Modifica `tailwind.config.js` para personalizar:

- Colores personalizados
- Espaciados
- Fuentes
- Plugins adicionales

### Agregar contenido

El archivo `tailwind.config.js` está configurado para procesar:

- `*.html` en la raíz del proyecto
- `src/**/*.{html,js}`
- `js/**/*.js`

Asegúrate de que tus archivos estén en estas rutas para que Tailwind los procese correctamente.

## Uso

1. Ejecuta `npm run dev` para iniciar el modo de desarrollo
2. Abre `index.html` en tu navegador
3. Los cambios en `src/styles.css` se compilarán automáticamente a `dist/styles.css`
