import React, { useState, useEffect } from "react";
import axios from "axios";

function ServiceBookingForm() {
    const [bookingId, setBookingId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [mechanicName, setMechanicName] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [status, setStatus] = useState("Booked");

    const [vehiclesList, setVehiclesList] = useState([]);
    const [bookings, setBookings] = useState([]);

    function generateNextBookingId(existingBookings) {
        var maxNum = 100;
        if (existingBookings && existingBookings.length > 0) {
            existingBookings.forEach(function (b) {
                if (b.bookingId) {
                    var numPart = parseInt(String(b.bookingId).replace(/[^0-9]/g, ""), 10);
                    if (!isNaN(numPart) && numPart > maxNum) {
                        maxNum = numPart;
                    }
                }
            });
        }
        return "SB" + (maxNum + 1);
    }

    function loadData() {
        Promise.all([
            axios.get("http://localhost:5000/servicebookings").catch(() => ({ data: [] })),
            axios.get("http://localhost:5000/vehicles").catch(() => ({ data: [] }))
        ]).then(function ([bookingsRes, vehiclesRes]) {
            const bList = bookingsRes.data || [];
            const vList = vehiclesRes.data || [];

            setBookings(bList);
            setVehiclesList(vList);
            setBookingId(generateNextBookingId(bList));
        });
    }

    useEffect(function () {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When selecting an existing customer and their vehicle
    function handleCustomerVehicleSelect(e) {
        const selectedReg = e.target.value;
        if (!selectedReg) {
            setVehicleNumber("");
            setVehicleModel("");
            setCustomerName("");
            return;
        }
        const match = vehiclesList.find(function (v) {
            const reg = v.VehicleNumber || v.vehicleNumber || "";
            return reg === selectedReg;
        });
        if (match) {
            const reg = match.VehicleNumber || match.vehicleNumber || "";
            const model = match.model || match.vehicleModel || "";
            const owner = match.ownerName || match.customerName || "";
            setVehicleNumber(reg);
            setVehicleModel(model);
            setCustomerName(owner);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "bookingId") setBookingId(value);
        else if (name === "customerName") setCustomerName(value);
        else if (name === "vehicleNumber") setVehicleNumber(value);
        else if (name === "vehicleModel") setVehicleModel(value);
        else if (name === "serviceType") setServiceType(value);
        else if (name === "bookingDate") setBookingDate(value);
        else if (name === "mechanicName") setMechanicName(value);
        else if (name === "estimatedCost") setEstimatedCost(value);
        else if (name === "status") setStatus(value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const bookingData = {
            bookingId: bookingId.trim(),
            customerName: customerName.trim(),
            vehicleNumber: vehicleNumber.trim(),
            vehicleModel: vehicleModel.trim(),
            serviceType: serviceType.trim(),
            bookingDate: bookingDate,
            mechanicName: mechanicName || "Kumar",
            estimatedCost: Number(estimatedCost),
            status: status
        };

        axios.post("http://localhost:5000/servicebookings", bookingData)
            .then(function () {
                alert("Service Appointment Booked Successfully (ID: " + bookingId + ")");
                setCustomerName("");
                setVehicleNumber("");
                setVehicleModel("");
                setServiceType("");
                setBookingDate("");
                setMechanicName("");
                setEstimatedCost("");
                loadData();
            })
            .catch(function (error) {
                console.error("Error booking service:", error);
                const msg = (error.response && error.response.data && (error.response.data.message || error.response.data.error)) || "Failed to book service";
                alert(msg);
            });
    }

    function handleMechanicChange(id, newMechanic) {
        axios.put("http://localhost:5000/servicebookings/" + id, {
            mechanicName: newMechanic,
            status: "In Progress"
        })
            .then(function () {
                alert("Mechanic Assigned Successfully: " + newMechanic);
                loadData();
            })
            .catch(function (error) {
                console.error("Error assigning mechanic:", error);
                alert("Failed to assign mechanic");
            });
    }

    function handleCancelBooking(id) {
        if (window.confirm("Cancel this service booking?")) {
            axios.delete("http://localhost:5000/servicebookings/" + id)
                .then(function () {
                    alert("Booking Cancelled Successfully");
                    loadData();
                })
                .catch(function (error) {
                    console.error("Error cancelling booking:", error);
                    alert("Failed to cancel booking");
                });
        }
    }

    return (
        <div>
            <h3>Book service</h3>

            {/* Select existing customer and vehicle to book service */}
            {vehiclesList.length > 0 && (
                <div className="form-row">
                    <label>Select Customer & Vehicle:</label>
                    <select className="form-select" value={vehicleNumber} onChange={handleCustomerVehicleSelect}>
                        <option value="">-- Choose Customer & Vehicle --</option>
                        {vehiclesList.map(function (v, i) {
                            const reg = v.VehicleNumber || v.vehicleNumber || "";
                            const model = v.model || v.vehicleModel || "";
                            const owner = v.ownerName || v.customerName || "";
                            return (
                                <option key={v._id || i} value={reg}>
                                    {owner} - {model} ({reg})
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>bookingId:</label>
                    <input
                        type="text"
                        name="bookingId"
                        className="form-input"
                        placeholder="e.g. SB101"
                        value={bookingId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>customerName:</label>
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
                    <label>vehicleNumber:</label>
                    <input
                        type="text"
                        name="vehicleNumber"
                        className="form-input"
                        placeholder="Vehicle Registration Number"
                        value={vehicleNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>vehicleModel:</label>
                    <input
                        type="text"
                        name="vehicleModel"
                        className="form-input"
                        placeholder="Vehicle Model"
                        value={vehicleModel}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>serviceType:</label>
                    <input
                        type="text"
                        name="serviceType"
                        className="form-input"
                        placeholder="e.g. General Service"
                        value={serviceType}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>bookingDate:</label>
                    <input
                        type="date"
                        name="bookingDate"
                        className="form-input"
                        value={bookingDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>mechanicName:</label>
                    <input
                        type="text"
                        name="mechanicName"
                        className="form-input"
                        placeholder="Mechanic Name"
                        value={mechanicName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>estimatedCost:</label>
                    <input
                        type="number"
                        name="estimatedCost"
                        className="form-input"
                        placeholder="Estimated Cost"
                        value={estimatedCost}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>status:</label>
                    <select
                        name="status"
                        className="form-select"
                        value={status}
                        onChange={handleChange}
                    >
                        <option value="Booked">Booked</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    Book Service
                </button>
            </form>

            <hr />

            <h3>View bookings</h3>
            <table className="simple-table" border="1">
                <thead>
                    <tr>
                        <th>bookingId</th>
                        <th>customerName</th>
                        <th>vehicleNumber</th>
                        <th>vehicleModel</th>
                        <th>serviceType</th>
                        <th>bookingDate</th>
                        <th>mechanicName</th>
                        <th>estimatedCost</th>
                        <th>status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(function (b, index) {
                        return (
                            <tr key={b._id || index}>
                                <td>{b.bookingId}</td>
                                <td>{b.customerName}</td>
                                <td>{b.vehicleNumber}</td>
                                <td>{b.vehicleModel}</td>
                                <td>{b.serviceType}</td>
                                <td>{b.bookingDate}</td>
                                <td>
                                    <select
                                        className="form-select"
                                        style={{ width: "auto", padding: "4px" }}
                                        value={b.mechanicName}
                                        onChange={function (e) { handleMechanicChange(b._id, e.target.value); }}
                                    >
                                        <option value="Kumar">Kumar</option>
                                        <option value="Ramesh">Ramesh</option>
                                        <option value="Suresh">Suresh</option>
                                        <option value="Anand">Anand</option>
                                    </select>
                                </td>
                                <td>{b.estimatedCost}</td>
                                <td>{b.status}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        style={{ fontSize: "12px", padding: "4px 8px" }}
                                        onClick={function () { handleCancelBooking(b._id); }}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {bookings.length === 0 && (
                        <tr>
                            <td colSpan="10" style={{ textAlign: "center", padding: "12px", color: "#666" }}>
                                No bookings found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ServiceBookingForm;
