# Proyecto Integrador ABP: Procesamiento de datos con APIS REST

## ¿De qué trata este proyecto?

Este proyecto es parte del ABP (Aprendizaje Basado en Proyectos) y consiste en consumir una API REST de productos, mostrar los datos en una interfaz moderna y calcular estadísticas útiles. Permite buscar, filtrar, ordenar, exportar y visualizar información de productos de manera interactiva.

---

## Funcionalidades principales

- **Listado de productos**: muestra tarjetas con imagen, nombre, precio y descripción.
- **Búsqueda**: filtra productos por nombre en tiempo real.
- **Filtrado por categoría**: permite ver productos de una categoría específica.
- **Paginación**: muestra los productos de a 9 por página y permite navegar entre páginas.
- **Ordenamiento**: se puede ordenar por precio o rating, ascendente o descendente.
- **Modo oscuro/claro**: cambia el tema visual de la app.
- **Exportar datos**: permite descargar los productos filtrados en formato JSON, CSV o Excel.
- **Estadísticas numéricas**: muestra datos como total de productos, precio promedio, producto más caro/barato, etc.
- **Estadísticas visuales**: incluye gráficos de barras, líneas y torta para visualizar stock, precios y categorías.
- **Gráficos interactivos**: los gráficos muestran tooltips claros y leyendas centradas.
- **Responsive**: la app se adapta a cualquier tamaño de pantalla.

---

## ¿Cómo está organizado el código?

- **App.jsx**:  
  Componente principal. Maneja el estado global, obtiene los datos de la API, filtra, ordena, pagina y calcula estadísticas. También controla el modo oscuro y la exportación de datos.

- **ProductList.jsx**:  
  Muestra los productos en tarjetas. Las imágenes se ven completas y centradas. Cada tarjeta tiene nombre, precio y descripción.

- **StatsPanel.jsx**:  
  Recibe los datos estadísticos y los muestra en formato numérico y gráfico. Los gráficos usan Recharts y están optimizados para que las etiquetas y leyendas sean legibles y estén bien ubicadas.

---

## ¿Cómo usar la app?

1. Cloná el repositorio y ejecutá `npm install`.
2. Corré `npm run dev` para ver la app en tu navegador.
3. Buscá, filtrá, ordená y explorá los productos.
4. Exportá los datos en el formato que quieras.
5. Alterná entre modo claro y oscuro según prefieras.

---

## Notas personales

- El código está dividido en componentes para que sea fácil de leer y modificar.
- Las estadísticas se calculan en el componente principal y se pasan como props.
- El modo oscuro funciona agregando o quitando la clase `dark` en el contenedor principal.
- Los gráficos y tooltips están optimizados para que sean claros y útiles.
- La paginación se reinicia automáticamente al cambiar de categoría para evitar páginas vacías.

---