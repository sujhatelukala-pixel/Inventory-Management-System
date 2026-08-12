import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
    });

    const [edit, setEdit] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );

            if (response.data.success) {
                setUser({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    address: response.data.user.address || "",
                    password: "",
                });
            }
        } catch (error) {
            console.error(
                "Error fetching user profile:",
                error.response?.data || error.message
            );
            alert("Error fetching user profile. Please try again.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                "http://localhost:3000/api/users/profile",
                {
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    password: user.password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );

            if (response.data.success) {
                setUser({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    address: response.data.user.address || "",
                    password: "",
                });

                setEdit(false);
                alert("Profile updated successfully");
            } else {
                alert(response.data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(
                "Error updating profile:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Error updating profile. Please try again."
            );
        }
    };

    const handleCancel = () => {
        setEdit(false);
        fetchUser();
    };

    return (
        <div className="w-full h-full min-h-screen bg-[#F5E6A8] p-4">
            <div className="w-[310px] bg-black text-white rounded-md shadow-sm p-4">
                <h2 className="text-xl font-bold text-white mb-4">
                    User Profile
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="name"
                            className="block text-xs font-medium text-white mb-1"
                        >
                            Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={user.name}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    name: e.target.value,
                                })
                            }
                            className="w-full h-[30px] border border-[#F5E6A8] rounded-md px-2 text-sm outline-none focus:border-[#d99a00] disabled:bg-[#F5E6A8] disabled:text-black"
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="block text-xs font-medium text-white mb-1"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    email: e.target.value,
                                })
                            }
                            className="w-full h-[30px] border border-gray-400 rounded-md px-2 text-sm outline-none focus:border-[#d99a00] disabled:bg-[#F5E6A8] disabled:text-black"
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="address"
                            className="block text-xs font-medium text-white mb-1"
                        >
                            Address
                        </label>

                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={user.address}
                            disabled={!edit}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    address: e.target.value,
                                })
                            }
                            className="w-full h-[30px] border border-gray-400 rounded-md px-2 text-sm outline-none focus:border-[#d99a00] disabled:bg-[#F5E6A8] disabled:text-black"
                        />
                    </div>

                    {edit && (
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                placeholder="Enter new password (optional)"
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full h-[30px] border border-gray-400 rounded-md px-2 text-sm outline-none focus:border-[#d99a00]"
                            />
                        </div>
                    )}

                    {!edit ? (
                        <button
                            type="button"
                            onClick={() => setEdit(true)}
                            className="bg-violet-400 hover:bg-violet-600 text-white text-sm font-medium px-3 py-2 rounded-md mt-1 cursor-pointer"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-500 cursor-pointer"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
