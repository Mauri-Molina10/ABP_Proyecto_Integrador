function ProductList(props) {
    // Si no hay productos, devuelvo un array vacío
    const products = Array.isArray(props.products) ? props.products : [];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="bg-white dark:bg-gray-900 border-2 border-purple-700 rounded-xl p-5 shadow-lg hover:shadow-purple-700 transition-all duration-300 text-gray-900 dark:text-gray-100 hover:scale-105"
                >
                    {/* Muestro la imagen del producto centrada y sin cortes */}
                    <div className="w-full h-48 flex items-center justify-center mb-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="max-h-44 w-auto object-contain"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                    </div>
                    {/* Título del producto */}
                    <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300 mb-2">
                        {p.title}
                    </h3>
                    {/* Precio */}
                    <p className="text-gray-700 dark:text-gray-200 text-xl mb-2">${p.price}</p>
                    {/* Descripción */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{p.description}</p>
                </div>
            ))}
        </div>
    );
}
export default ProductList;