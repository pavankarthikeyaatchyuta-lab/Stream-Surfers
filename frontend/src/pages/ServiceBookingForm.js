/* Page 2: Service Bookings Component (ServiceBookingForm.js) */
import React, { useState, useEffect } from "react";
import axios from "axios";
/* Service Booking Form and Active Bookings Table Component */
function ServiceBookingForm() {
    /* Form input states */
    const [bookingId, setBookingId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [mechanicName, setMechanicName] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [status, setStatus] = useState("Booked");
    /* Bookings and registered vehicles list */
    const [vehiclesList, setVehiclesList] = useState([]);
    const [bookings, setBookings] = useState([]);
    /* Auto-generate sequential Booking ID */
    function generateNextBookingId(existingBookings) {
        var maxNum = 100;
        if (existingBookings && existingBookings.length > 0) {
            existingBookings.forEach(function (b) {
                if (b.bookingId) {
                    var numPart = parseInt(String(b.bookingId).replace(/[^0-9]/g, ""), 10);
                    if (!isNaN(numPart) && numPart > maxNum) { maxNum = numPart; }
                }
            });
        }
        return "SB" + (maxNum + 1);
    }
    /* Fetch bookings and vehicles from backend */
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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(function () { loadData(); }, []);
    /* Vehicle dropdown change auto-fill */
    function handleCustomerVehicleSelect(e) {
        const selectedReg = e.target.value;
        if (!selectedReg) { setVehicleNumber(""); setVehicleModel(""); setCustomerName(""); return; }
        const match = vehiclesList.find(function (v) { return (v.VehicleNumber || v.vehicleNumber || "") === selectedReg; });
        if (match) {
            setVehicleNumber(match.VehicleNumber || match.vehicleNumber || "");
            setVehicleModel(match.model || match.vehicleModel || "");
            setCustomerName(match.ownerName || match.customerName || "");
        }
    }
    /* Input change handler */
    function handleChange(e) {
        const { name, value } = e.target;
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
    /* Service appointment submit */
    function handleSubmit(e) {
        e.preventDefault();
        const bookingData = { bookingId: bookingId.trim(), customerName: customerName.trim(), vehicleNumber: vehicleNumber.trim(), vehicleModel: vehicleModel.trim(), serviceType: serviceType.trim(), bookingDate: bookingDate, mechanicName: mechanicName || "Kumar", estimatedCost: Number(estimatedCost), status: status };
        axios.post("http://localhost:5000/servicebookings", bookingData)
            .then(function () {
                alert("Service Appointment Booked Successfully (ID: " + bookingId + ")");
                setCustomerName(""); setVehicleNumber(""); setVehicleModel(""); setServiceType(""); setBookingDate(""); setMechanicName(""); setEstimatedCost("");
                loadData();
            })
            .catch(function (err) {
                console.error("Error booking service:", err);
                alert((err.response && err.response.data && (err.response.data.message || err.response.data.error)) || "Failed to book service");
            });
    }
    /* Inline mechanic assignment */
    function handleMechanicChange(id, newMechanic) {
        axios.put("http://localhost:5000/servicebookings/" + id, { mechanicName: newMechanic, status: "In Progress" })
            .then(function () { alert("Mechanic Assigned Successfully: " + newMechanic); loadData(); })
            .catch(function (err) { console.error("Error assigning mechanic:", err); alert("Failed to assign mechanic"); });
    }
    /* Cancel service booking */
    function handleCancelBooking(id) {
        if (window.confirm("Cancel this service booking?")) {
            axios.delete("http://localhost:5000/servicebookings/" + id)
                .then(function () { alert("Booking Cancelled Successfully"); loadData(); })
                .catch(function (err) { console.error("Error cancelling booking:", err); alert("Failed to cancel booking"); });
        }
    }
    return (
        <div>
            {/* 1. Book Service Appointment Form */}
            <h3 className="section-title">Book Service Appointment</h3>
            <div className="form-card">
                {vehiclesList.length > 0 && (
                    <div className="form-row">
                        <label>Select Customer & Vehicle:</label>
                        <select className="form-select" value={vehicleNumber} onChange={handleCustomerVehicleSelect}>
                            <option value="">-- Choose Customer & Vehicle --</option>
                            {vehiclesList.map(function (v, i) {
                                const reg = v.VehicleNumber || v.vehicleNumber || "";
                                const model = v.model || v.vehicleModel || "";
                                const owner = v.ownerName || v.customerName || "";
                                return <option key={v._id || i} value={reg}>{owner} - {model} ({reg})</option>;
                            })}
                        </select>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-row"><label>Booking ID:</label><input type="text" name="bookingId" className="form-input" placeholder="e.g. SB101" value={bookingId} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Customer Name:</label><input type="text" name="customerName" className="form-input" placeholder="Customer Name" value={customerName} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Vehicle Number:</label><input type="text" name="vehicleNumber" className="form-input" placeholder="Vehicle Registration Number" value={vehicleNumber} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Vehicle Model:</label><input type="text" name="vehicleModel" className="form-input" placeholder="Vehicle Model" value={vehicleModel} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Service Type:</label><input type="text" name="serviceType" className="form-input" placeholder="e.g. General Service" value={serviceType} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Booking Date:</label><input type="date" name="bookingDate" className="form-input" value={bookingDate} onChange={handleChange} required /></div>
                    <div className="form-row"><label>Mechanic Name:</label><input type="text" name="mechanicName" className="form-input" placeholder="Mechanic Name" value={mechanicName} onChange={handleChange} /></div>
                    <div className="form-row"><label>Estimated Cost (₹):</label><input type="number" name="estimatedCost" className="form-input" placeholder="Estimated Cost" value={estimatedCost} onChange={handleChange} required /></div>
                    <div className="form-row">
                        <label>Status:</label>
                        <select name="status" className="form-select" value={status} onChange={handleChange}>
                            <option value="Booked">Booked</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="btn-center"><button type="submit" className="btn btn-primary">Book Service Appointment</button></div>
                </form>
            </div>
            <hr className="divider" />
            {/* 2. Active Service Bookings Directory Table */}
            <h3 className="section-title">Active Service Bookings</h3>
            <div className="table-responsive booking-table-wrapper">
                <table className="simple-table booking-table">
                    <thead>
                        <tr><th>Booking ID</th><th>Customer</th><th>Vehicle No</th><th>Model</th><th>Service Type</th><th>Date</th><th>Mechanic</th><th>Est. Cost</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {bookings.map(function (b, index) {
                            const dateStr = b.bookingDate ? String(b.bookingDate).split("T")[0] : "-";
                            return (
                                <tr key={b._id || index}>
                                    <td><strong>{b.bookingId}</strong></td><td>{b.customerName}</td><td>{b.vehicleNumber}</td><td>{b.vehicleModel}</td><td>{b.serviceType}</td><td>{dateStr}</td>
                                    <td>
                                        <select className="form-select" style={{ width: "auto", padding: "3px 6px", fontSize: "12px" }} value={b.mechanicName} onChange={function (e) { handleMechanicChange(b._id, e.target.value); }}>
                                            <option value="Kumar">Kumar</option><option value="Ramesh">Ramesh</option><option value="Suresh">Suresh</option><option value="Anand">Anand</option>
                                        </select>
                                    </td>
                                    <td>₹{b.estimatedCost}</td>
                                    <td><span className={`status-badge ${b.status === "Completed" ? "status-completed" : (b.status === "In Progress" ? "status-in-progress" : "status-booked")}`}>{b.status}</span></td>
                                    <td><button type="button" className="btn btn-danger btn-sm" onClick={function () { handleCancelBooking(b._id); }}>Cancel</button></td>
                                </tr>
                            );
                        })}
                        {bookings.length === 0 && (
                            <tr><td colSpan="10" style={{ padding: "16px", color: "#64748b" }}>No service bookings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default ServiceBookingForm;
