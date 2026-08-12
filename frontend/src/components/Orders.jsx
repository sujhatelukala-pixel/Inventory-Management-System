import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Orders = () => {
    const[orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                console.error('Error fetching products:', response.data.message);
                alert('Error fetching products. Please try again');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 bg-[#F5E6A8]">
            <h1 className="text-2xl font-bold">Orders</h1>
            <div>
                <table className="w-full border-collapse border border-[#F5E6A8] mt-4 bg-black text-white">
                    <thead>
                        <tr className="bg-[#F5E6A8] text-black border-[#F5E6A8]">
                            <th className="border p-2">S No</th>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Category Name</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Total Price</th>
                            <th className="border p-2">Order Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders && orders.map((order, index) => (
                            <tr key={order._id}>
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{order.product.name}</td>
                                <td className="border p-2">{order.product.categoryId.categoryName}</td>
                                <td className="border p-2">{order.quantity}</td>
                                <td className="border p-2">{order.totalPrice}</td>

                                <td className="border p-2">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders;