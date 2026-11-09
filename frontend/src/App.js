import React, { useState, useEffect } from "react";
import "./App.css";

import LandingPage from "./LandingPage";
import CustomerForm from "./CustomerForm";
import ServiceBookingForm from "./ServiceBookingForm";
import ServiceBillForm from "./ServiceBillForm";

const ROUTES = {
  "/": "landing",
  "/landing": "landing",
  "/home": "landing",
  "/customers-vehicles": "customers-vehicles",
  "/customers": "customers-vehicles",
  "/vehicles": "customers-vehicles",
  "/service-bookings": "service-bookings",
  "/servicebookings": "service-bookings",
  "/servicebills": "servicebills",
  "/service-bills": "servicebills"
};

const PATHS = {
  landing: "/",
  "customers-vehicles": "/customers-vehicles",
  "service-bookings": "/servicebookings",
  servicebills: "/servicebills"
};

function App() {
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    return ROUTES[path] || ROUTES["/" + path.split("/")[1]] || "landing";
  });

  const navigate = (tab) => {
    const targetPath = PATHS[tab] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, "", targetPath);
    }
    setCurrentTab(tab);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const resolvedTab = (event.state && event.state.tab) || ROUTES[path] || "landing";
      setCurrentTab(resolvedTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app-container">
      {currentTab !== "landing" && (
        <div className="app-header">
          <h2 className="app-title">
            Vehicle Service Center Management System
          </h2>
        </div>
      )}

      <div className="nav-links">
        <button
          type="button"
          className={`nav-btn ${currentTab === "landing" ? "active" : ""}`}
          onClick={() => navigate("landing")}
        >
          Home
        </button>
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

      {currentTab === "landing" && (
        <LandingPage onGetStarted={(tab) => navigate(tab || "customers-vehicles")} />
      )}

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
