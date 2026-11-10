/* Navigation Bar Component (Navbar.js) */
import React from "react";
/* Navbar Component rendering title and tab buttons */
function Navbar({ currentTab, navigate }) {
  return (
    <div>
      {/* Title heading in Times New Roman on inner pages */}
      {currentTab !== "home" && (
        <div className="app-header">
          <h2 className="app-title">Vehicle Service Center Management System</h2>
        </div>
      )}
      {/* Top navigation tabs with solid fill hover */}
      <nav className="nav-links">
        <button type="button" className={`nav-btn ${currentTab === "home" ? "active" : ""}`} onClick={() => navigate("home")}>Home</button>
        <button type="button" className={`nav-btn ${currentTab === "customers-vehicles" ? "active" : ""}`} onClick={() => navigate("customers-vehicles")}>1. Customers & Vehicles</button>
        <button type="button" className={`nav-btn ${currentTab === "service-bookings" ? "active" : ""}`} onClick={() => navigate("service-bookings")}>2. Service Bookings</button>
        <button type="button" className={`nav-btn ${currentTab === "servicebills" ? "active" : ""}`} onClick={() => navigate("servicebills")}>3. Service Bills</button>
      </nav>
      {/* Divider rule */}
      <hr className="divider" />
    </div>
  );
}
export default Navbar;
