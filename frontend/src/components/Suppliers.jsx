import React, { useEffect, useState } from "react";
import axios from "axios";

const Suppliers = () => {
  const [addModel, setAddModel] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSuppliers = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/api/supplier",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      setSuppliers(response.data.suppliers);
      setFilteredSuppliers(response.data.suppliers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);

    setFormData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
    });

    setAddModel(true);
  };

  const closeModel = () => {
    setAddModel(false);
    setEditSupplier(null);

    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editSupplier) {
        // UPDATE
        const response = await axios.put(
          `http://localhost:3000/api/supplier/${editSupplier._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("Supplier Updated Successfully");
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("Supplier Added Successfully");
        }
      }

      fetchSuppliers();
      closeModel();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Supplier?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/supplier/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Supplier deleted successfully");
          fetchSuppliers();
        } else {
          console.error("Error deleting Supplier:", data);
          alert("Error deleting Supplier. Please try again.");
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert("Error deleting supplier. Please try again.");
        }
      }
    }
  }
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(value) ||
        supplier.email.toLowerCase().includes(value) ||
        supplier.number.toLowerCase().includes(value) ||
        supplier.address.toLowerCase().includes(value)
    );

    setFilteredSuppliers(filtered);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 p-4 bg-[#F5E6A8]">
      <h1 className="text-2xl font-bold">Supplier Management</h1>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded bg-black text-white"
          onChange={handleSearch}
        />

        <button
          className="px-4 py-2 bg-violet-400 text-white rounded cursor-pointer hover:bg-violet-600"
          onClick={() => {
            setEditSupplier(null);

            setFormData({
              name: "",
              email: "",
              number: "",
              address: "",
            });

            setAddModel(true);
          }}
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-black text-white">
          <table className="w-full border-collapse border border-gray-300 mt-4 bg-bslck">
            <thead>
              <tr className="bg-[#F5E6A8] text-black">
                <th className="border p-2">S No</th>
                <th className="border p-2">Supplier Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone Number</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{supplier.name}</td>
                  <td className="border p-2">{supplier.email}</td>
                  <td className="border p-2">{supplier.number}</td>
                  <td className="border p-2">{supplier.address}</td>

                  <td className="border p-2">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 cursor-pointer"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </button>

                    <button className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer"
                      onClick={() => handleDelete(supplier._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSuppliers.length === 0 && <div>No records</div>}
        </div>
      )}

      {addModel && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-md shadow-lg w-[450px] p-6 relative">
            <h1 className="text-3xl font-bold mb-4">
              {editSupplier ? "Edit Supplier" : "Add Supplier"}
            </h1>

            <button
              className="absolute top-4 right-5 text-2xl font-bold cursor-pointer"
              onClick={closeModel}
            >
              ×
            </button>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Supplier Name"
                className="border rounded p-2"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Supplier Email"
                className="border rounded p-2"
                required
              />

              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Supplier Phone Number"
                className="border rounded p-2"
                required
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Supplier Address"
                className="border rounded p-2"
                required
              />

              {editSupplier ? (
                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded cursor-pointer"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={closeModel}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded mt-2 cursor-pointer"
                >
                  Add Supplier
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;