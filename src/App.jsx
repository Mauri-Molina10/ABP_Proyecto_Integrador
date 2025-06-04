import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ProductList from "./components/ProductList";
import StatsPanel from "./components/StatsPanel";

function App() {
    // Estados principales de la app
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [page, setPage] = useState(1);
    const [format, setFormat] = useState("json");
    // Orden por defecto: rating descendente (los mejor calificados primero)
    const [orderBy, setOrderBy] = useState("rating-desc");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [exportMsg, setExportMsg] = useState(null);

    const containerRef = useRef(null);
    const limit = 9;

    // Inicializo productos 
    useEffect(() => {
        axios
            .get("https://dummyjson.com/products?limit=100")
            .then((res) => {
                setProducts(res.data.products);
            });
    }, []);

    // Inicializo categorías
    useEffect(() => {
        axios
            .get("https://dummyjson.com/products/categories")
            .then((res) => {
                const cats = res.data.map(cat =>
                    typeof cat === "string"
                        ? { value: cat, label: cat }
                        : { value: cat.slug, label: cat.name }
                );
                setCategories(cats);
            });
    }, []);

    // Todas las categorías presentes en los productos
    const productCategories = Array.from(new Set(products.map(p => p.category)));

    // Filtro productos por búsqueda y categoría
    let filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
    }

    // Ordeno productos según criterio
    let orderedProducts = [...filteredProducts];
    if (orderBy === "price-asc") {
        orderedProducts.sort((a, b) => a.price - b.price);
    } else if (orderBy === "price-desc") {
        orderedProducts.sort((a, b) => b.price - a.price);
    } else if (orderBy === "rating-asc") {
        orderedProducts.sort((a, b) => a.rating - b.rating);
    } else if (orderBy === "rating-desc") {
        orderedProducts.sort((a, b) => b.rating - a.rating);
    } else if (orderBy === "alpha-asc") {
        orderedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (orderBy === "alpha-desc") {
        orderedProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Calculo el rango de productos a mostrar según la página
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = orderedProducts.slice(start, end);

    // Estadísticas para el panel
    const totalProducts = orderedProducts.length;

    let maxProduct = null;
    if (orderedProducts.length > 0) {
        maxProduct = orderedProducts[0];
        for (let p of orderedProducts) {
            if (p.price > maxProduct.price) {
                maxProduct = p;
            }
        }
    }

    let minProduct = null;
    if (orderedProducts.length > 0) {
        minProduct = orderedProducts[0];
        for (let p of orderedProducts) {
            if (p.price < minProduct.price) {
                minProduct = p;
            }
        }
    }

    let countLongTitles = 0;
    for (let p of orderedProducts) {
        if (p.title.length > 20) {
            countLongTitles++;
        }
    }

    let totalPrice = 0;
    for (let p of orderedProducts) {
        totalPrice += p.price;
    }
    totalPrice = totalPrice.toFixed(2);

    let avgDiscount = 0;
    if (orderedProducts.length > 0) {
        let sumDiscount = 0;
        for (let p of orderedProducts) {
            sumDiscount += p.discountPercentage;
        }
        avgDiscount = (sumDiscount / orderedProducts.length).toFixed(2);
    }

    let lowStockCount = 0;
    for (let p of orderedProducts) {
        if (p.stock < 50) {
            lowStockCount++;
        }
    }

    let maxDiscountProduct = null;
    if (orderedProducts.length > 0) {
        maxDiscountProduct = orderedProducts[0];
        for (let p of orderedProducts) {
            if (p.discountPercentage > maxDiscountProduct.discountPercentage) {
                maxDiscountProduct = p;
            }
        }
    }

    let avgPrice = 0;
    if (orderedProducts.length > 0) {
        avgPrice = (totalPrice / orderedProducts.length).toFixed(2);
    }

    // Alterno entre modo claro y oscuro
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
        if (containerRef.current) {
            containerRef.current.classList.toggle("dark");
        }
    };

    // Cuando cambio de categoría, vuelvo a la página 1
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setPage(1);
    };

    // Exporto productos filtrados en el formato elegido
    const handleExport = () => {
        try {
            if (orderedProducts.length === 0) {
                setExportMsg({ type: "error", text: "No hay productos para exportar." });
                return;
            }
            if (format === "json") {
                const blob = new Blob([JSON.stringify(orderedProducts, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "productos.json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setExportMsg({ type: "success", text: "Exportación a JSON exitosa." });
            } else if (format === "csv") {
                const headers = Object.keys(orderedProducts[0]);
                const csvRows = [
                    headers.join(","),
                    ...orderedProducts.map(prod =>
                        headers.map(h => `"${String(prod[h]).replace(/"/g, '""')}"`).join(",")
                    ),
                ];
                const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "productos.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setExportMsg({ type: "success", text: "Exportación a CSV exitosa." });
            } else if (format === "excel") {
                const headers = Object.keys(orderedProducts[0]);
                const rows = orderedProducts.map(prod =>
                    `<Row>${headers.map(h => `<Cell><Data ss:Type="String">${String(prod[h]).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</Data></Cell>`).join("")}</Row>`
                );
                const xml =
                    `<?xml version="1.0"?>
                    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                        xmlns:o="urn:schemas-microsoft-com:office:office"
                        xmlns:x="urn:schemas-microsoft-com:office:excel"
                        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
                        <Worksheet ss:Name="Productos">
                            <Table>
                                <Row>${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join("")}</Row>
                                ${rows.join("")}
                            </Table>
                        </Worksheet>
                    </Workbook>`;
                const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "productos.xls";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setExportMsg({ type: "success", text: "Exportación a Excel exitosa." });
            }
        } catch (error) {
            setExportMsg({ type: "error", text: "Error al exportar el archivo." });
        }
        setTimeout(() => setExportMsg(null), 4000);
    };

    // Paso a la siguiente página
    const nextPage = () => setPage((prev) => prev + 1);
    // Vuelvo a la página anterior
    const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

    return (
        <div
            ref={containerRef}
            className={`min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-8 transition-colors duration-300`}
        >
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-purple-700 text-gray-100 dark:bg-purple-300 dark:text-gray-900 shadow hover:bg-purple-600 dark:hover:bg-purple-400 transition-all duration-300 z-50"
            >
                {darkMode ? "Modo claro" : "Modo oscuro"}
            </button>
            <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-400 mb-8 drop-shadow-lg tracking-wide text-center">
                AXIOS
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                <input
                    type="text"
                    placeholder="Buscar producto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-96 px-4 py-2 rounded-lg border-2 border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
                />
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="px-4 py-2 rounded-lg border-2 border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                    <option value="all">Todas las categorías</option>
                    {categories
                        .filter(cat => typeof cat.value === "string" && productCategories.includes(cat.value))
                        .map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                </select>
                {/* Nuevo ordenamiento: alfabético, precio y rating */}
                <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                    <option value="alpha-asc">Alfabético A-Z</option>
                    <option value="alpha-desc">Alfabético Z-A</option>
                    <option value="price-asc">Precio ascendente</option>
                    <option value="price-desc">Precio descendente</option>
                    <option value="rating-asc">Rating ascendente</option>
                    <option value="rating-desc">Rating descendente</option>
                </select>
                <select
                    onChange={(e) => setFormat(e.target.value)}
                    value={format}
                    className="px-4 py-2 rounded-lg border-2 border-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                    <option value="json">Exportar JSON</option>
                    <option value="csv">Exportar CSV</option>
                    <option value="excel">Exportar Excel</option>
                </select>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg bg-purple-700 text-gray-100 dark:bg-purple-300 dark:text-gray-900 shadow hover:bg-purple-600 dark:hover:bg-purple-400 transition-all duration-300"
                >
                    Exportar archivo
                </button>
            </div>
            {/* Mensaje de exportación */}
            {exportMsg && (
                <div className={`mb-4 px-4 py-2 rounded text-center font-semibold ${exportMsg.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {exportMsg.text}
                </div>
            )}
            <ProductList products={paginatedProducts} />
            <div className="flex justify-center gap-4 my-4">
                <button
                    onClick={prevPage}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-purple-700 text-gray-100 dark:bg-purple-300 dark:text-gray-900 shadow hover:bg-purple-600 dark:hover:bg-purple-400 transition-all duration-300 disabled:opacity-50"
                >
                    Página anterior
                </button>
                <span className="self-center text-lg text-purple-700 dark:text-purple-300">
                    Página {page}
                </span>
                <button
                    onClick={nextPage}
                    disabled={end >= orderedProducts.length}
                    className="px-4 py-2 rounded-lg bg-purple-700 text-gray-100 dark:bg-purple-300 dark:text-gray-900 shadow hover:bg-purple-600 dark:hover:bg-purple-400 transition-all duration-300 disabled:opacity-50"
                >
                    Página siguiente
                </button>
            </div>
            <button
                onClick={() => setShow(!show)}
                className="px-6 py-2 mb-6 rounded-lg bg-purple-700 text-gray-100 font-semibold shadow hover:bg-purple-600 transition-all duration-300"
            >
                {show ? "Ocultar estadísticas" : "Mostrar estadísticas"}
            </button>
            {show && (
                <StatsPanel
                    products={orderedProducts}
                    total={totalProducts}
                    max={maxProduct}
                    min={minProduct}
                    countLongTitles={countLongTitles}
                    totalPrice={totalPrice}
                    avgDiscount={avgDiscount}
                    lowStockCount={lowStockCount}
                    maxDiscountProduct={maxDiscountProduct}
                    avgPrice={avgPrice}
                />
            )}
            {orderedProducts.length === 0 && <div>No se encontraron productos</div>}
        </div>
    );
}

export default App;