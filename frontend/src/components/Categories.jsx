import React, { useEffect, useState } from 'react'
import axios from 'axios';


const Categories = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editCategory, setEditCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/category", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            console.log(response.data.categories);
            setCategories(response.data.categories);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories;", error);
            setLoading(false);
        }
        };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(editCategory) {
            const response = await axios.put(
                `http://localhost:3000/api/category/${editCategory._id}`,
                { categoryName, categoryDescription},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );
            if (response.data.success) {
                setEditCategory(null);
                setCategoryName("");
                setCategoryDescription("");
                alert("Category updated successfully!");
                fetchCategories();
            }else{
                console.error("Error editing category", response.data);
                alert("Error editing category. Please try again.");
            }
        } else {
             const response = await axios.post(
                "http://localhost:3000/api/category/add",
                { categoryName, categoryDescription},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
            );
            if (response.data.success) {
                setCategoryName("");
                setCategoryDescription("");
                alert("Category added successfully!");
                fetchCategories();
            }else{
                console.error("Error adding category", response.data);
                alert("Error adding category. Please try again.");
            }
        }
        
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?");
        if(confirmDelete) {
            try {
                const response = await axios.delete(
                    `http://localhost:3000/api/category/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                );
                if (response.data.success) {
                    alert("Category deleted successfully");
                    fetchCategories();
                } else {
                    console.error("Error deleting category:", data);
                    alert("Error deleting category. Please try again.");
                }
            } catch (error) {
                if(error.response) {
                    alert(error.response.data.message);
                }else{
                    alert("Error deleting category. Please try again.");
                }
            }
        }
    }

    const handleEdit = async (category) => {
        setEditCategory(category);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription);
    };
    const handleCancel = async () => {
        setEditCategory(null);
        setCategoryName("");
        setCategoryDescription("");
    };

    if (loading) return <div>Loading....</div>
  return (
    <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-[#F5E6A8]'>
        <h1 className='text-2xl font-bold mb-8'>Category Management</h1>
        
        <div className='flex flex-col lg:flex-row gap-4'>
            <div className='lg:w-1/3'>
                <div className='bg-black shadow-md rounded-lg p-4'>
                    <h2 className='text-center text-white text-xl font-bold mb-4'>{editCategory ? "Edit Category" : "Add Category"}</h2>
                    <form className='space-y-4' onSubmit={handleSubmit}>
                        <div>
                            <input
                            type='text'
                            placeholder='Category Name'
                            value={categoryName}
                            className='border w-full p-2 rounded-md text-white'
                            onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                            type='text'
                            placeholder='Category Description'
                            value={categoryDescription}
                            className='border w-full p-2 rounded-md text-white'
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            />
                        </div>
                        <div className='flex space-x-2'>
                        <button
                          type='submit'
                          className='w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600'
                        >
                            {editCategory ? "Save Changes" : "Add Category"}
                        </button>
                        {
                            editCategory && (
                                <button
                                  type='button'
                                  className='w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600'
                                  onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )
                        }
                        </div>
                    </form>
                </div>
            </div>
            <div className='lg:w-2/3'>
               <div className='bg-black shadow-md rounded-lg p-4'>
                   <table className='w-full border-collapse border border-[#F5E6A8] text-white'>
                      <thead>
                        <tr className='bg-[#F5E6A8]'>
                            <th className='border border-[#F5E6A8] p-2 text-black'>S No</th>
                            <th className='border border-[#F5E6A8] p-2 text-black'>Category Name</th>
                            <th className='border border-[#F5E6A8] p-2 text-black'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) => (
                            <tr key={index}>
                                <td className='border border-[#F5E6A8] p-2'>{index + 1}</td>
                                <td className='border border-[#F5E6A8] p-2'>{category.categoryName}</td>
                                <td className='border border-[#F5E6A8] p-2'>
                                    <div className='flex justify-center gap-2'>
                                        <button className='w-20 bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600' onClick={() => handleEdit(category)}>
                                            Edit
                                        </button>
                                        <button className='w-20 bg-red-400 text-white py-2 rounded-md hover:bg-red-600' onClick={() => handleDelete(category._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                      </tbody>
                   </table>
               </div>
            </div>
        </div>

    </div>
  );
}

export default Categories;