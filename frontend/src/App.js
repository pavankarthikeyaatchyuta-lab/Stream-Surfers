import React, { useState, useEffect } from "react";
import "./App.css";

import CustomerForm from "./CustomerForm";
import ServiceBookingForm from "./ServiceBookingForm";
import ServiceBillForm from "./ServiceBillForm";

const ROUTES = {
  "/": "customers-vehicles",
  "/customers-vehicles": "customers-vehicles",
  "/customers": "customers-vehicles",
  "/vehicles": "customers-vehicles",
  "/service-bookings": "service-bookings",
  "/servicebookings": "service-bookings",
  "/servicebills": "servicebills",
  "/service-bills": "servicebills"
};

const PATHS = {
  "customers-vehicles": "/customers-vehicles",
  "service-bookings": "/servicebookings",
  servicebills: "/servicebills"
};

function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    return ROUTES[path] || ROUTES["/" + path.split("/")[1]] || "customers-vehicles";
  });

  const navigate = (tab) => {
    const targetPath = PATHS[tab] || "/customers-vehicles";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, "", targetPath);
    }
    setCurrentTab(tab);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const resolvedTab = (event.state && event.state.tab) || ROUTES[path] || "customers-vehicles";
      setCurrentTab(resolvedTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h2 className="app-title">Vehicle Service Center Management System</h2>
        <p className="app-subtitle">Team Trivion (Team 13) • Problem Statement M27: Stream Surfers</p>
      </div>

      <div className="nav-links">
        <button
          type="button"
          className={`nav-btn ${currentTab === "customers-vehicles" ? "active" : ""}`}
          onClick={() => navigate("customers-vehicles")}
        >
          1. Customers & Vehicles
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === "service-bookings" ? "active" : ""}`}
          onClick={() => navigate("service-bookings")}
        >
          2. Service Bookings
        </button>
        <button
          type="button"
          className={`nav-btn ${currentTab === "servicebills" ? "active" : ""}`}
          onClick={() => navigate("servicebills")}
        >
          3. Service Bills
        </button>
      </div>

      <hr className="divider" />

      {currentTab === "customers-vehicles" && (
        <div>
          <CustomerForm />
        </div>
      )}

      {currentTab === "service-bookings" && (
        <div>
          <ServiceBookingForm />
        </div>
      )}

      {currentTab === "servicebills" && (
        <div>
          <ServiceBillForm />
        </div>
      )}
    </div>
  );
}

export default App;
