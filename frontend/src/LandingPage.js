import React, { useState, useEffect } from "react";
import axios from "axios";

function LandingPage({ onGetStarted }) {
  const [stats, setStats] = useState({
    vehiclesCount: 0,
    bookingsCount: 0,
    inProgressCount: 0,
    billsCount: 0,
    recentBookings: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehiclesRes, bookingsRes, billsRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/vehicles"),
          axios.get("http://localhost:5000/servicebookings"),
          axios.get("http://localhost:5000/servicebills")
        ]);

        const vehicles = vehiclesRes.status === "fulfilled" && Array.isArray(vehiclesRes.value.data) ? vehiclesRes.value.data : [];
        const bookings = bookingsRes.status === "fulfilled" && Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : [];
        const bills = billsRes.status === "fulfilled" && Array.isArray(billsRes.value.data) ? billsRes.value.data : [];

        const activeServices = bookings.filter(function (b) {
          const s = (b.status || "").toLowerCase();
          return s === "in progress" || s === "pending" || s === "booked";
        });

        const recent = bookings.slice(-4).reverse();

        setStats({
          vehiclesCount: vehicles.length,
          bookingsCount: bookings.length,
          inProgressCount: activeServices.length,
          billsCount: bills.length,
          recentBookings: recent
        });
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.78)), url(${process.env.PUBLIC_URL || ""}/images/workshop-banner.jpg)`
  };

  return (
    <div className="landing-container">
      <div className="landing-hero" style={heroStyle}>
        <h1 className="landing-title">
          Vehicle Service Center Management System
        </h1>

        <div className="landing-actions">
          <button
            type="button"
            className="btn btn-get-started"
            onClick={() => onGetStarted("customers-vehicles")}
          >
            Get Started →
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onGetStarted("customers-vehicles")}>
          <div className="kpi-value">{stats.vehiclesCount}</div>
          <div className="kpi-label">Registered Vehicles</div>
        </div>

        <div className="kpi-card" onClick={() => onGetStarted("service-bookings")}>
          <div className="kpi-value">{stats.bookingsCount}</div>
          <div className="kpi-label">Total Bookings</div>
        </div>

        <div className="kpi-card" onClick={() => onGetStarted("service-bookings")}>
          <div className="kpi-value">{stats.inProgressCount}</div>
          <div className="kpi-label">Active In-Service</div>
        </div>

        <div className="kpi-card" onClick={() => onGetStarted("servicebills")}>
          <div className="kpi-value">{stats.billsCount}</div>
          <div className="kpi-label">Bills Generated</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-header">
          <h3 className="section-title">Recent Service Activity</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onGetStarted("service-bookings")}
          >
            View All Bookings →
          </button>
        </div>

        <div className="table-responsive">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service Type</th>
                <th>Mechanic</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((b, idx) => (
                  <tr key={b._id || idx}>
                    <td><strong>{b.bookingId}</strong></td>
                    <td>{b.customerName}</td>
                    <td>{b.vehicleModel} ({b.vehicleNumber})</td>
                    <td>{b.serviceType}</td>
                    <td>{b.mechanicName || "Unassigned"}</td>
                    <td>
                      <span className={`status-badge ${
                        (b.status || "").toLowerCase() === "completed"
                          ? "status-completed"
                          : (b.status || "").toLowerCase() === "in progress"
                          ? "status-in-progress"
                          : "status-booked"
                      }`}>
                        {b.status || "Booked"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: "16px", color: "#64748b" }}>
                    No bookings recorded yet. Click "Get Started" to create the first record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
