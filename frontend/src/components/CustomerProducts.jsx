import axios from "axios";
import React, { useState, useEffect } from "react";

const CustomerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openModel, setOpenModel] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [stockError, setStockError] = useState("");

    const [orderData, setOrderData] = useState({
        productId: "",
        quantity: 1,
        total: 0,
        stock: 0,
        price: 0,
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "pos-token"
                        )}`,
                    },
                }
            );

            if (response.data.success) {
                setCategories(response.data.categories);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } else {
                showAlert("Error fetching products", "error");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            showAlert("Error fetching products", "error");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);

        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 3000);
    };

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();

        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchValue)
            )
        );
    };

    const handleChangeCategory = (e) => {
        const categoryId = e.target.value;

        if (categoryId === "") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter(
                    (product) => product.categoryId._id === categoryId
                )
            );
        }
    };

    const handleOrderChange = (product) => {
        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price,
        });

        setStockError("");
        setAlertMessage("");
        setAlertType("");
        setOpenModel(true);
    };

    const closeModel = () => {
        setOpenModel(false);
        setStockError("");
        setAlertMessage("");
        setAlertType("");
    };

    const handleQuantityChange = (e) => {
        const quantity = Number(e.target.value);

        if (quantity === 0) {
            setOrderData({
                ...orderData,
                quantity: 0,
                total: 0,
            });
            setStockError("");
            return;
        }

        if (quantity > orderData.stock) {
            setStockError(
                `Not enough stock. Only ${orderData.stock} items available.`
            );
            return;
        }

        if (quantity < 1 || isNaN(quantity)) {
            return;
        }

        setStockError("");

        setOrderData({
            ...orderData,
            quantity: quantity,
            total: quantity * orderData.price,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (orderData.quantity > orderData.stock) {
            setStockError(
                `Not enough stock. Only ${orderData.stock} items available.`
            );
            return;
        }

        if (orderData.quantity < 1) {
            setStockError("Quantity must be at least 1.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/orders/add",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "pos-token"
                        )}`,
                    },
                }
            );

            if (response.data.success) {
                setOpenModel(false);

                setOrderData({
                    productId: "",
                    quantity: 1,
                    stock: 0,
                    total: 0,
                    price: 0,
                });

                alert("Order added successfully");
            }
        } catch (error) {
            alert("Error " + error);
        }
    };


    return (
        <div className="bg-[#F5E6A8] min-h-screen">
            {alertMessage && (
                <div
                    className={`fixed top-5 right-5 z-[100] px-5 py-3  rounded-lg shadow-lg text-white font-semibold ${alertType === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                >
                    {alertMessage}
                </div>
            )}

            <div className="py-4 px-6">
                <h2 className="font-bold text-xl">Products</h2>
            </div>

            <div className="py-4 px-6 flex justify-between items-center">
                <div>
                    <select
                        name="category"
                        className="bg-white border p-1 rounded"
                        onChange={handleChangeCategory}
                    >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="border p-2 rounded bg-black text-white"
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div>
                <table className="w-full border-collapse border border-gray-300 mt-4 bg-black text-white">
                    <thead>
                        <tr className="bg-[#F5E6A8] text-black">
                            <th className="border p-2">S No</th>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Category Name</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className="border p-2">
                                    {index + 1}
                                </td>

                                <td className="border p-2">
                                    {product.name}
                                </td>

                                <td className="border p-2">
                                    {product.categoryId.categoryName}
                                </td>

                                <td className="border p-2">
                                    ₹{product.price}
                                </td>

                                <td className="border p-2">
                                    {product.stock === 0 ? (
                                        <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">
                                            {product.stock}
                                        </span>
                                    ) : product.stock < 5 ? (
                                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                                            {product.stock}
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                            {product.stock}
                                        </span>
                                    )}
                                </td>

                                <td className="border p-2">
                                    <button
                                        onClick={() =>
                                            handleOrderChange(product)
                                        }
                                        disabled={product.stock === 0}
                                        className="px-2 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded mr-2 cursor-pointer"
                                    >
                                        Order
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModel && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-20">
                    <div className="bg-white w-[500px] rounded-lg p-6 relative">
                        <button
                            className="absolute top-3 right-5 text-3xl font-bold"
                            onClick={closeModel}
                        >
                            ×
                        </button>

                        <h1 className="text-4xl font-bold mb-6">
                            Place Order
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <label className="font-semibold">
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={orderData.quantity}
                                min="1"
                                onChange={handleQuantityChange}
                                className={`border p-2 rounded ${stockError
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />

                            {stockError && (
                                <p className="text-red-500 font-semibold">
                                    {stockError}
                                </p>
                            )}

                            <div className="flex justify-between">
                                <span>Price:</span>
                                <span>₹{orderData.price}</span>
                            </div>

                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>₹{orderData.total}</span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    onClick={closeModel}
                                    className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProducts;