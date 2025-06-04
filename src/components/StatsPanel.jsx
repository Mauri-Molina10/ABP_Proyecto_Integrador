import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

// Tooltip para mostrar datos claros en todos los gráficos
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Si es PieChart, muestro nombre, cantidad y porcentaje
        if (payload[0].payload && payload[0].payload.value !== undefined && payload[0].payload.name !== undefined) {
            const total = payload[0].payload.total || payload.reduce((sum, entry) => sum + entry.value, 0);
            const percent = ((payload[0].payload.value / total) * 100).toFixed(1);
            return (
                <div style={{
                    background: "#2d2d2d",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "8px 12px",
                    border: "1px solid #888",
                    fontSize: 13,
                    maxWidth: 220
                }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>{payload[0].payload.name}</div>
                    <div>
                        Productos: <span style={{ fontWeight: "bold" }}>{payload[0].payload.value}</span>
                    </div>
                    <div>
                        Porcentaje: <span style={{ fontWeight: "bold" }}>{percent}%</span>
                    </div>
                </div>
            );
        }
        // Para barras y líneas
        return (
            <div style={{
                background: "#2d2d2d",
                color: "#fff",
                borderRadius: 8,
                padding: "8px 12px",
                border: "1px solid #888",
                fontSize: 13,
                maxWidth: 220
            }}>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</div>
                {payload.map((entry, idx) => (
                    <div key={idx}>
                        {entry.name}: <span style={{ fontWeight: "bold" }}>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

function StatsPanel(props) {
    // Preparo los datos para los gráficos
    const topProducts = (props.products || []).slice(0, 7);
    const barData = topProducts.map(p => ({ name: p.title, stock: p.stock }));
    const lineData = topProducts.map(p => ({ name: p.title, price: p.price }));

    // Armo los datos para el gráfico de torta (categorías)
    const categoryCount = {};
    (props.products || []).forEach(p => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    const totalPie = Object.values(categoryCount).reduce((a, b) => a + b, 0);
    const pieData = Object.entries(categoryCount).map(([cat, count]) => ({
        name: cat,
        value: count,
        total: totalPie
    }));
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#a28fd0", "#f7b267"];

    // Etiqueta personalizada para el gráfico de torta
    const renderPieLabel = ({ name, percent }) => {
        let label = name.length > 15 ? name.slice(0, 13) + "…" : name;
        return (
            <tspan fontSize="12">{label} ({(percent * 100).toFixed(0)}%)</tspan>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 border-2 border-purple-600 rounded-xl p-6 mb-6 shadow-lg transition-all duration-300 text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">Estadísticas</h2>
            
            {/* Estadísticas numéricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <span className="font-semibold">Total productos:</span> {props.total}
                </div>
                <div>
                    <span className="font-semibold">Producto más caro:</span> {props.max?.title} (${props.max?.price})
                </div>
                <div>
                    <span className="font-semibold">Producto más barato:</span> {props.min?.title} (${props.min?.price})
                </div>
                <div>
                    <span className="font-semibold">Títulos largos (&gt;20):</span> {props.countLongTitles}
                </div>
                <div>
                    <span className="font-semibold">Precio total:</span> ${props.totalPrice}
                </div>
                <div>
                    <span className="font-semibold">Descuento promedio:</span> {props.avgDiscount}%
                </div>
                <div>
                    <span className="font-semibold">Stock bajo (&lt;50):</span> {props.lowStockCount}
                </div>
                <div>
                    <span className="font-semibold">Mayor descuento:</span> {props.maxDiscountProduct?.title} ({props.maxDiscountProduct?.discountPercentage}%)
                </div>
                <div>
                    <span className="font-semibold">Precio promedio:</span> ${props.avgPrice}
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Barras: Stock */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Stock (Top 7 productos)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <XAxis 
                                dataKey="name" 
                                angle={-30} 
                                textAnchor="end" 
                                interval={0} 
                                height={70}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="stock" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Líneas: Precio */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Precio (Top 7 productos)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineData}>
                            <XAxis 
                                dataKey="name" 
                                angle={-30} 
                                textAnchor="end" 
                                interval={0} 
                                height={70}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/* Pie: Categorías */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Productos por categoría</h3>
                    <ResponsiveContainer width="100%" height={340}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="48%"
                                outerRadius={100}
                                label={renderPieLabel}
                                labelLine={false}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend 
                                layout="horizontal" 
                                align="center" 
                                verticalAlign="bottom" 
                                iconType="circle"
                                wrapperStyle={{
                                    marginTop: 20,
                                    fontSize: 13,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    flexWrap: "wrap"
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default StatsPanel;