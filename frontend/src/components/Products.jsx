import axios from "axios";
import React, { useEffect, useState } from "react";

const Products = () => {
    const [openModel, setOpenModel] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: "",
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/products",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );
            console.log(response.data);
            if (response.data.success) {
                setCategories(response.data.categories);
                setSuppliers(response.data.suppliers);
                setProducts(response.data.products);
                setFilteredProducts(response.data.products)
            } else {
                console.error('Error fetching products:', response.data.message);
                alert('Error fetching products. Please try again');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (product) => {
        setOpenModel(true);
        setEditProduct(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId._id,
            supplierId: product.supplierId._id,
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this Product?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `http://localhost:3000/api/products/${id}`,                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                );
                if (response.data.success) {
                    alert("Product deleted successfully");
                    fetchProducts();
                } else {
                    console.error("Error deleting Product:", data);
                    alert("Error deleting Product. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting Product:", error);
                alert("Error deleting Product. Please try again.");
            }
        }
    }

    const closeModel = () => {
        setOpenModel(false);
        setEditProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            supplierId: ""
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editProduct) {
            try {
                const response = await axios.put(
                    `http://localhost:3000/api/products/${editProduct}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                );

                if (response.data.success) {
                    alert("Product updated Successfully");
                    fetchProducts();
                    setOpenModel(false);
                    setEditProduct(false);
                    setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        categoryId: "",
                        supplierId: "",
                    });
                } else {
                    alert("Error updating Product. Please try again.");
                }
            } catch (error) {
                alert("Error updating product. Please try again");
            }
            return;
        } else {
            try {
                const response = await axios.post(
                    "http://localhost:3000/api/products/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                );

                if (response.data.success) {
                    fetchProducts();
                    alert("Product added Successfully");
                    setOpenModel(false);
                    setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        categoryId: "",
                        supplierId: "",
                    });
                } else {
                    alert("Error adding Product. Please try again.");
                }
            } catch (error) {
                alert("Error adding product. Please try again");
            }
        }
    };

    const handleSearch = (e) => {
        setFilteredProducts(
            products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase()))
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 bg-[#F5E6A8]">
            <h1 className="text-2xl font-bold">Product Management</h1>

            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="border p-2 rounded bg-black text-white"
                    onChange={handleSearch}
                />

                <button
                    className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
                    onClick={() => setOpenModel(true)}
                >
                    Add Product
                </button>
            </div>

            <div>
                <table className="w-full border-collapse border border-[#F5E6A8] bg-black text-white mt-4">
                    <thead>
                        <tr className="bg-[#F5E6A8] text-black">
                            <th className="border p-2">S No</th>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Category Name</th>
                            <th className="border p-2">Supplier Name</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Stock</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts && filteredProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{product.name}</td>
                                <td className="border p-2">{product.categoryId.categoryName}</td>
                                <td className="border p-2">{product.supplierId.name}</td>
                                <td className="border p-2">{product.price}</td>
                                <td className="border p-2">
                                    <span className="rounded-full font-semibold">
                                        {product.stock == 0 ? (
                                            <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">{product.stock}</span>
                                        ) : product.stock < 5 ? (
                                            <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">{product.stock}</span>
                                        ) : (<span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">{product.stock}</span>)}
                                    </span>
                                </td>

                                <td className="border p-2">
                                    <button
                                        className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 cursor-pointer"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>

                                    <button className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                                        onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModel && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <div className="bg-white w-[500px] rounded-lg p-6 relative">

                        <button
                            className="absolute top-3 right-5 text-3xl font-bold"
                            onClick={closeModel}
                        >
                            ×
                        </button>

                        <h1 className="text-4xl font-bold mb-6">
                            Add Product
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Product Name"
                                className="border p-2 rounded"
                                required
                            />

                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border p-2 rounded"
                                required
                            />

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter Price"
                                className="border p-2 rounded"
                                required
                            />

                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Enter Stock"
                                className="border p-2 rounded"
                                required
                            />

                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            >
                                <option value="">Select Category</option>

                                {categories.map((category) => {
                                    console.log(category);
                                    return (
                                        <option key={category._id} value={category._id}>
                                            {category.categoryName}
                                        </option>
                                    );
                                })}
                            </select>

                            <select
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            >
                                <option value="">Select Supplier</option>

                                {suppliers.map((supplier) => {
                                    console.log(supplier);
                                    return (
                                        <option key={supplier._id} value={supplier._id}>
                                            {supplier.name}
                                        </option>
                                    );
                                })}
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
                                >
                                    {editProduct ? "Save Changes" : "Add Product"}
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

export default Products;