/**
 * ==============================================================================
 * COMPONENT: APPLICATION NAVBAR & HEADER (Navbar.js)
 * ==============================================================================
 * This component handles the primary application header and top navigation:
 * 1. Application title heading (styled with Times New Roman, plain text).
 * 2. Top navigation tab buttons (Home, Customers & Vehicles, Bookings, Bills).
 * 3. Highlights the active tab and provides solid hover transitions.
 * ==============================================================================
 */

import React from "react";

function Navbar({ currentTab, navigate }) {
  return (
    <div>
      {/* -------------------------------------------------------------
          1. APPLICATION HEADER (Times New Roman, plain text, no link)
          ------------------------------------------------------------- */}
      {currentTab !== "home" && (
        <div className="app-header">
          <h2 className="app-title">
            Vehicle Service Center Management System
          </h2>
        </div>
      )}

      {/* -------------------------------------------------------------
          2. TOP NAVIGATION TAB BAR
          ------------------------------------------------------------- */}
      <nav className="nav-links">
        {/* Home Tab */}
        <button
          type="button"
          className={`nav-btn ${currentTab === "home" ? "active" : ""}`}
          onClick={() => navigate("home")}
        >
          Home
        </button>

        {/* Page 1 Tab: Customers & Vehicles */}
        <button
          type="button"
          className={`nav-btn ${currentTab === "customers-vehicles" ? "active" : ""}`}
          onClick={() => navigate("customers-vehicles")}
        >
          1. Customers & Vehicles
        </button>

        {/* Page 2 Tab: Service Bookings */}
        <button
          type="button"
          className={`nav-btn ${currentTab === "service-bookings" ? "active" : ""}`}
          onClick={() => navigate("service-bookings")}
        >
          2. Service Bookings
        </button>

        {/* Page 3 Tab: Service Bills */}
        <button
          type="button"
          className={`nav-btn ${currentTab === "servicebills" ? "active" : ""}`}
          onClick={() => navigate("servicebills")}
        >
          3. Service Bills
        </button>
      </nav>

      {/* Visual divider separating navigation from the active page view */}
      <hr className="divider" />
    </div>
  );
}

export default Navbar;
