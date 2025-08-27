# Madera Son — EPK estático (lista para desplegar)

Este proyecto es una **página EPK editable** (versión estática) para el grupo *Madera Son*. Está diseñada para no necesitar compilación: usa React + Babel en el navegador para permitir edición rápida y persistencia local (localStorage).

Archivos principales:
- `index.html` — entrada principal.
- `index.jsx` — aplicación React (JSX compilado por Babel en el navegador).
- `styles.css` — estilos básicos.
- `README.md` — este archivo.

--- 

## Opciones para desplegar en Vercel

### Opción A — (Recomendada) Desplegar desde un repositorio GitHub
1. Crea un repositorio en GitHub (público o privado).
2. Sube esta carpeta (`index.html`, `index.jsx`, `styles.css`, `README.md`) al repositorio y haz `git push`.
3. Ve a https://vercel.com y crea una cuenta o inicia sesión.
4. Haz clic en **New Project** → **Import Git Repository** → selecciona el repositorio que creaste.
5. Vercel detectará tu proyecto. Si pide configuración, selecciona **Other** o deja los campos por defecto (no hay comando de build; el sitio es estático).
6. Pulsa **Deploy**. En unos segundos tendrás un dominio tipo `https://<tu-proyecto>.vercel.app`.

### Opción B — Usar Vercel CLI (sin Git)
Requiere tener Node.js/npm instalado.

1. Instala la CLI de Vercel:
   ```
   npm i -g vercel
   ```
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta:
   ```
   vercel
   ```
   - Si es la primera vez te pedirá iniciar sesión (abre el navegador y autoriza).
   - Cuando pregunte por el directorio del proyecto presiona Enter (raíz).
   - Para "Framework" elige `Other`.
4. La CLI subirá y te dará una URL temporal y una URL de producción del tipo `https://<tu-proyecto>.vercel.app`.

### Notas importantes
- Este proyecto guarda datos en **localStorage** del navegador. Si quieres que los cambios se vean a todos los visitantes, deberás:
  - Editar los archivos localmente y subirlos al repositorio y redeployar, o
  - Implementar un backend o Google Sheets / Airtable para guardar contenido (no incluido).
- Los visitantes no necesitan pagar; el sitio será accesible públicamente sin coste.

--- 

Si quieres, puedo:
- Generar por ti el repositorio listo para subir a GitHub (zip con `.git` no incluido, pero con instrucciones).
- Hacer el despliegue yo mismo si me das acceso a tu cuenta (no es posible desde aquí), o guiarte paso a paso mientras lo haces.
