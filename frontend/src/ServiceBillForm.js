import React, { useState, useEffect } from "react";
import axios from "axios";

function ServiceBillForm() {
    const [billId, setBillId] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [billDate, setBillDate] = useState("");
    
    const [bills, setBills] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);

    function generateNextBillId(existingBills) {
        var maxNum = 100;
        if (existingBills && existingBills.length > 0) {
            existingBills.forEach(function (b) {
                const idVal = b.billNumber || b.billId;
                if (idVal) {
                    var numPart = parseInt(String(idVal).replace(/[^0-9]/g, ""), 10);
                    if (!isNaN(numPart) && numPart > maxNum) {
                        maxNum = numPart;
                    }
                }
            });
        }
        return "BILL" + (maxNum + 1);
    }

    function loadData() {
        Promise.all([
            axios.get("http://localhost:5000/servicebills").catch(() => ({ data: [] })),
            axios.get("http://localhost:5000/servicebookings").catch(() => ({ data: [] }))
        ]).then(function ([billsRes, bookingsRes]) {
            const bList = billsRes.data || [];
            const bkList = bookingsRes.data || [];

            setBills(bList);
            setBookingsList(bkList);
            setBillId(generateNextBillId(bList));
        });
    }

    useEffect(function () {
        loadData();
    }, []);

    function handleCustomerVehicleSelect(e) {
        const selectedBookingId = e.target.value;
        if (!selectedBookingId) {
            setBookingId("");
            setCustomerName("");
            setVehicleNumber("");
            setTotalAmount("");
            return;
        }
        const match = bookingsList.find(b => String(b.bookingId) === String(selectedBookingId));
        if (match) {
            setBookingId(match.bookingId);
            setCustomerName(match.customerName);
            setVehicleNumber(match.vehicleNumber);
            setTotalAmount(match.estimatedCost);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const numericAmount = Number(totalAmount) || 0;
        const formattedDate = billDate || new Date().toISOString().split("T")[0];

        const billData = {
            billNumber: billId,
            billId: billId,
            bookingId: bookingId,
            customerName: customerName.trim(),
            vehicleNumber: vehicleNumber.trim(),
            partsCost: 0,
            laborCost: numericAmount,
            totalCost: numericAmount,
            totalAmount: numericAmount,
            billedDate: formattedDate,
            billDate: formattedDate
        };

        axios.post("http://localhost:5000/servicebills", billData)
            .then(function () {
                alert("Service Bill Generated Successfully for " + customerName + " (" + vehicleNumber + ")");
                setCustomerName("");
                setVehicleNumber("");
                setTotalAmount("");
                setBillDate("");
                setBookingId("");
                loadData();
            })
            .catch(function (error) {
                console.error("Error generating bill:", error);
                const msg = (error.response && error.response.data && (error.response.data.message || error.response.data.error)) || "Failed to generate bill";
                alert(msg);
            });
    }

    return (
        <div>
            <h3>Generate service bill</h3>

            {/* Select customer and vehicle to generate the bill */}
            {bookingsList.length > 0 && (
                <div className="form-row">
                    <label>Select Customer & Vehicle:</label>
                    <select className="form-select" value={bookingId} onChange={handleCustomerVehicleSelect}>
                        <option value="">-- Choose Customer & Vehicle --</option>
                        {bookingsList.map(function (b, i) {
                            return (
                                <option key={b._id || i} value={b.bookingId}>
                                    {b.customerName} - {b.vehicleModel} ({b.vehicleNumber}) [Booking: {b.bookingId}]
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>billNumber:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. BILL101"
                        value={billId}
                        onChange={function (e) { setBillId(e.target.value); }}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>bookingId:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. SB101"
                        value={bookingId}
                        onChange={function (e) { setBookingId(e.target.value); }}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>customerName:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={function (e) { setCustomerName(e.target.value); }}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>vehicleNumber:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Vehicle Number"
                        value={vehicleNumber}
                        onChange={function (e) { setVehicleNumber(e.target.value); }}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>totalCost:</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Total Cost"
                        value={totalAmount}
                        onChange={function (e) { setTotalAmount(e.target.value); }}
                        required
                    />
                </div>
 
                <div className="form-row">
                    <label>billedDate:</label>
                    <input
                        type="date"
                        className="form-input"
                        value={billDate}
                        onChange={function (e) { setBillDate(e.target.value); }}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Generate Service Bill
                </button>
            </form>

            <hr />

            <h3>Service bills</h3>
            <table className="simple-table" border="1">
                <thead>
                    <tr>
                        <th>billNumber</th>
                        <th>bookingId</th>
                        <th>customerName</th>
                        <th>vehicleNumber</th>
                        <th>totalCost</th>
                        <th>billedDate</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map(function (bill, index) {
                        const billNum = bill.billNumber || bill.billId || "-";
                        const totCost = bill.totalCost != null ? bill.totalCost : (bill.totalAmount != null ? bill.totalAmount : "-");
                        let dateDisplay = bill.billDate;
                        if (bill.billedDate) {
                            try {
                                dateDisplay = new Date(bill.billedDate).toISOString().split("T")[0];
                            } catch (e) {
                                dateDisplay = String(bill.billedDate);
                            }
                        }

                        return (
                            <tr key={bill._id || index}>
                                <td>{billNum}</td>
                                <td>{bill.bookingId}</td>
                                <td>{bill.customerName}</td>
                                <td>{bill.vehicleNumber}</td>
                                <td>{totCost}</td>
                                <td>{dateDisplay || "-"}</td>
                            </tr>
                        );
                    })}
                    {bills.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "12px", color: "#666" }}>
                                No bills found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ServiceBillForm;
