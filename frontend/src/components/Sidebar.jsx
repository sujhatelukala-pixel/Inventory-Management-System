import React from 'react';
import {
    FaBox,
    FaCog,
    FaHome,
    FaShoppingCart,
    FaSignOutAlt,
    FaTable,
    FaTruck,
    FaUsers
} from "react-icons/fa";
import { NavLink, useLocation } from 'react-router';

const Sidebar = () => {

    // Admin sidebar items
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaHome />,
            isParent: true
        },
        {
            name: "Categories",
            path: "/admin/dashboard/categories",
            icon: <FaTable />,
            isParent: false
        },
        {
            name: "Products",
            path: "/admin/dashboard/products",
            icon: <FaBox />,
            isParent: false
        },
        {
            name: "Suppliers",
            path: "/admin/dashboard/suppliers",
            icon: <FaTruck />,
            isParent: false
        },
        {
            name: "Orders",
            path: "/admin/dashboard/orders",
            icon: <FaShoppingCart />,
            isParent: false
        },
        {
            name: "Users",
            path: "/admin/dashboard/users",
            icon: <FaUsers />,
            isParent: false
        },
        {
            name: "Profile",
            path: "/admin/dashboard/profile",
            icon: <FaCog />,
            isParent: false
        },
        {
            name: "Logout",
            path: "/admin/dashboard/logout",
            icon: <FaSignOutAlt />,
            isParent: false
        }
    ];

    // Customer sidebar items
    const customerItems = [
        {
            name: "Products",
            path: "/customer/dashboard",
            icon: <FaBox />,
            isParent: true
        },
        {
            name: "Orders",
            path: "/customer/dashboard/orders",
            icon: <FaShoppingCart />,
            isParent: false
        },
        {
            name: "Profile",
            path: "/customer/dashboard/profile",
            icon: <FaCog />,
            isParent: false
        },
        {
            name: "Logout",
            path: "/customer/dashboard/logout",
            icon: <FaSignOutAlt />,
            isParent: false
        }
    ];

    // Get current URL
    const location = useLocation();

    // Show admin menu for admin URLs,
    // customer menu for customer URLs
    const menuLinks = location.pathname.startsWith("/admin")
        ? menuItems
        : customerItems;

    return (
        <div className="flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed">

            {/* Logo */}
            <div className="h-16 flex items-center justify-center">
                <span className="hidden md:block text-xl font-bold">
                    Inventory MS
                </span>

                <span className="md:hidden text-xl font-bold">
                    IMS
                </span>
            </div>

            {/* Menu */}
            <div>
                <ul className="space-y-2 p-2">

                    {menuLinks.map((item) => (
                        <li key={item.name}>

                            <NavLink
                                to={item.path}
                                end={item.isParent}
                                className={({ isActive }) =>
                                    `${isActive ? "bg-gray-700" : ""}
                                    flex items-center gap-3 p-2 rounded-md
                                    hover:bg-gray-700
                                    transition duration-200`
                                }
                            >

                                {/* Icon */}
                                <span className="text-xl flex items-center">
                                    {item.icon}
                                </span>

                                {/* Name */}
                                <span className="hidden md:block">
                                    {item.name}
                                </span>

                            </NavLink>

                        </li>
                    ))}

                </ul>
            </div>

        </div>
    );
};

export default Sidebar;