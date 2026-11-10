/**
 * ==============================================================================
 * PAGE 1: CUSTOMERS & VEHICLES (CustomerForm.js)
 * ==============================================================================
 * This file contains ALL code and logic exclusively for Page 1:
 * 1. Customer registration (Name, Phone, Email).
 * 2. Vehicle registration (Registration Number, Vehicle Model).
 * 3. Search vehicles by registration number.
 * 4. Registered Vehicles directory table with inline Edit & Delete actions.
 * ==============================================================================
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

function CustomerForm() {
    // --------------------------------------------------------------------------
    // Form Input States
    // --------------------------------------------------------------------------
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");

    // --------------------------------------------------------------------------
    // Directory Data, Search & Edit States
    // --------------------------------------------------------------------------
    const [vehicles, setVehicles] = useState([]);
    const [searchRegNo, setSearchRegNo] = useState("");
    const [editVehicle, setEditVehicle] = useState(null);

    // --------------------------------------------------------------------------
    // API: Fetch all registered vehicles from backend
    // --------------------------------------------------------------------------
    function loadVehicles() {
        axios.get("http://localhost:5000/vehicles")
            .then(function (response) {
                setVehicles(response.data || []);
            })
            .catch(function (error) {
                console.error("Error loading vehicles:", error);
            });
    }

    // Load registered vehicles on initial component mount
    useEffect(function () {
        loadVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --------------------------------------------------------------------------
    // Input Change Handler
    // --------------------------------------------------------------------------
    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "customerName") setCustomerName(value);
        else if (name === "phone") setPhone(value);
        else if (name === "email") setEmail(value);
        else if (name === "vehicleNumber") setVehicleNumber(value);
        else if (name === "vehicleModel") setVehicleModel(value);
    }

    // --------------------------------------------------------------------------
    // API: Add Customer and Vehicle
    // --------------------------------------------------------------------------
    function handleSubmit(event) {
        event.preventDefault();

        const numericPhone = Number(String(phone).replace(/[^0-9]/g, "")) || Number(phone);

        const customerData = {
            customerName: customerName.trim(),
            phone: numericPhone,
            mail: email.trim(),
            mailid: email.trim(),
            email: email.trim()
        };

        const vehicleData = {
            VehicleNumber: vehicleNumber.toUpperCase().trim(),
            vehicleNumber: vehicleNumber.toUpperCase().trim(),
            model: vehicleModel.trim(),
            vehicleModel: vehicleModel.trim(),
            ownerName: customerName.trim(),
            customerName: customerName.trim(),
            ownerPhone: numericPhone,
            contactNumber: numericPhone
        };

        // First save customer, then save linked vehicle
        axios.post("http://localhost:5000/customers", customerData)
            .then(function () {
                return axios.post("http://localhost:5000/vehicles", vehicleData);
            })
            .then(function () {
                alert("Customer and Vehicle Added Successfully");
                setCustomerName("");
                setPhone("");
                setEmail("");
                setVehicleNumber("");
                setVehicleModel("");
                loadVehicles();
            })
            .catch(function (error) {
                console.error("Error:", error);
                const msg = (error.response && error.response.data && (error.response.data.message || error.response.data.error)) || "Failed to add customer and vehicle";
                alert(msg);
            });
    }

    // --------------------------------------------------------------------------
    // API: Initialize Inline Edit for a Vehicle
    // --------------------------------------------------------------------------
    function handleStartEdit(v) {
        setEditVehicle({
            _id: v._id,
            VehicleNumber: v.VehicleNumber || v.vehicleNumber || "",
            model: v.model || v.vehicleModel || "",
            ownerName: v.ownerName || v.customerName || "",
            ownerPhone: v.ownerPhone || v.contactNumber || v.phone || ""
        });
    }

    // --------------------------------------------------------------------------
    // API: Submit Updated Vehicle Details
    // --------------------------------------------------------------------------
    function handleUpdateSubmit(event) {
        event.preventDefault();

        const numericPhone = Number(String(editVehicle.ownerPhone).replace(/[^0-9]/g, "")) || Number(editVehicle.ownerPhone);

        const updatePayload = {
            VehicleNumber: editVehicle.VehicleNumber,
            vehicleNumber: editVehicle.VehicleNumber,
            model: editVehicle.model,
            vehicleModel: editVehicle.model,
            ownerName: editVehicle.ownerName,
            customerName: editVehicle.ownerName,
            ownerPhone: numericPhone,
            contactNumber: numericPhone
        };

        axios.put("http://localhost:5000/vehicles/" + editVehicle._id, updatePayload)
            .then(function () {
                alert("Vehicle Updated Successfully");
                setEditVehicle(null);
                loadVehicles();
            })
            .catch(function (error) {
                console.error("Error:", error);
                alert("Failed to update vehicle");
            });
    }

    // --------------------------------------------------------------------------
    // API: Delete a Vehicle Record
    // --------------------------------------------------------------------------
    function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this vehicle record?")) {
            axios.delete("http://localhost:5000/vehicles/" + id)
                .then(function () {
                    alert("Vehicle Deleted Successfully");
                    loadVehicles();
                })
                .catch(function (error) {
                    console.error("Error:", error);
                    alert("Failed to delete vehicle");
                });
        }
    }

    // --------------------------------------------------------------------------
    // Filter vehicles based on search input
    // --------------------------------------------------------------------------
    const filteredVehicles = vehicles.filter(function (v) {
        const reg = (v.VehicleNumber || v.vehicleNumber || "").toLowerCase();
        return reg.includes(searchRegNo.toLowerCase().trim());
    });

    return (
        <div>
            {/* -------------------------------------------------------------
                1. ADD CUSTOMER & VEHICLE REGISTRATION FORM
                ------------------------------------------------------------- */}
            <h3 className="section-title">Add Customer & Vehicle</h3>
            
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Customer Name:</label>
                        <input
                            type="text"
                            name="customerName"
                            className="form-input"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Email Address:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Registration Number:</label>
                        <input
                            type="text"
                            name="vehicleNumber"
                            className="form-input"
                            placeholder="e.g. AP37AB1234"
                            value={vehicleNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Vehicle Model:</label>
                        <input
                            type="text"
                            name="vehicleModel"
                            className="form-input"
                            placeholder="e.g. Honda City"
                            value={vehicleModel}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="btn-center">
                        <button type="submit" className="btn btn-primary">
                            Add Customer & Vehicle
                        </button>
                    </div>
                </form>
            </div>

            <hr className="divider" />

            {/* -------------------------------------------------------------
                2. REGISTERED CUSTOMERS AND VEHICLES DIRECTORY
                ------------------------------------------------------------- */}
            <h3 className="section-title">Registered Customers and Vehicles</h3>

            {/* Registration Number Search Bar */}
            <div className="search-bar">
                <label>Search vehicles using registration number:</label>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter registration number (e.g. AP37AB123)"
                    value={searchRegNo}
                    onChange={function (e) { setSearchRegNo(e.target.value); }}
                />
            </div>

            {/* Inline Edit Form (Displayed when Edit is clicked) */}
            {editVehicle && (
                <div className="inline-edit-box">
                    <h4>Edit Vehicle Record</h4>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-row">
                            <label>Registration Number:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editVehicle.VehicleNumber}
                                onChange={function (e) {
                                    setEditVehicle(Object.assign({}, editVehicle, { VehicleNumber: e.target.value }));
                                }}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label>Vehicle Model:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editVehicle.model}
                                onChange={function (e) {
                                    setEditVehicle(Object.assign({}, editVehicle, { model: e.target.value }));
                                }}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label>Owner Name:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editVehicle.ownerName}
                                onChange={function (e) {
                                    setEditVehicle(Object.assign({}, editVehicle, { ownerName: e.target.value }));
                                }}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <label>Contact Number:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editVehicle.ownerPhone}
                                onChange={function (e) {
                                    setEditVehicle(Object.assign({}, editVehicle, { ownerPhone: e.target.value }));
                                }}
                                required
                            />
                        </div>

                        <div className="btn-center">
                            <button type="submit" className="btn btn-primary btn-sm" style={{ marginRight: "8px" }}>
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={function () { setEditVehicle(null); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Registered Vehicles Table */}
            <div className="table-responsive">
                <table className="simple-table">
                    <thead>
                        <tr>
                            <th>Vehicle Number</th>
                            <th>Vehicle Model</th>
                            <th>Customer Name</th>
                            <th>Contact Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map(function (v, index) {
                            const reg = v.VehicleNumber || v.vehicleNumber || "-";
                            const model = v.model || v.vehicleModel || "-";
                            const owner = v.ownerName || v.customerName || "-";
                            const phoneVal = v.ownerPhone || v.contactNumber || v.phone || "-";

                            return (
                                <tr key={v._id || index}>
                                    <td><strong>{reg}</strong></td>
                                    <td>{model}</td>
                                    <td>{owner}</td>
                                    <td>{phoneVal}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                style={{ marginRight: "6px" }}
                                                onClick={function () { handleStartEdit(v); }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={function () { handleDelete(v._id); }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredVehicles.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: "16px", color: "#64748b" }}>
                                    No registered vehicles found matching the search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomerForm;
