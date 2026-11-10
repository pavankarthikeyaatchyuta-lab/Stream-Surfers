/**
 * ==============================================================================
 * APPLICATION ROOT & ROUTER (App.js)
 * ==============================================================================
 * This file serves as the main application shell and router:
 * 1. Defines URL route mapping and navigation state synchronization.
 * 2. Renders the shared Navbar component (Title + Navigation Tabs).
 * 3. Conditionally renders each page from src/pages/ in complete isolation.
 * ==============================================================================
 */

import React, { useState, useEffect } from "react";
import "./App.css";

// Shared Component Imports
import Navbar from "./components/Navbar";

// Dedicated Page Component Imports (Modular architecture in src/pages/)
import HomePage from "./pages/HomePage";
import CustomerForm from "./pages/CustomerForm";
import ServiceBookingForm from "./pages/ServiceBookingForm";
import ServiceBillForm from "./pages/ServiceBillForm";

// URL Route Mapping
const ROUTES = {
  "/": "home",
  "/home": "home",
  "/landing": "home",
  "/customers-vehicles": "customers-vehicles",
  "/customers": "customers-vehicles",
  "/vehicles": "customers-vehicles",
  "/service-bookings": "service-bookings",
  "/servicebookings": "service-bookings",
  "/servicebills": "servicebills",
  "/service-bills": "servicebills"
};

// Canonical Path Mapping
const PATHS = {
  home: "/",
  "customers-vehicles": "/customers-vehicles",
  "service-bookings": "/servicebookings",
  servicebills: "/servicebills"
};

function App() {
  // Navigation state initialized from the browser window location
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    return ROUTES[path] || ROUTES["/" + path.split("/")[1]] || "home";
  });

  // Navigate to a specific page and update the browser history
  const navigate = (tab) => {
    const targetPath = PATHS[tab] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, "", targetPath);
    }
    setCurrentTab(tab);
  };

  // Synchronize navigation state with browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const resolvedTab = (event.state && event.state.tab) || ROUTES[path] || "home";
      setCurrentTab(resolvedTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="app-container">
      {/* -------------------------------------------------------------
          1. APPLICATION HEADER & NAVIGATION (Shared Navbar Component)
          ------------------------------------------------------------- */}
      <Navbar currentTab={currentTab} navigate={navigate} />

      {/* -------------------------------------------------------------
          2. DEDICATED PAGE VIEWS (Modular Components from src/pages/)
          ------------------------------------------------------------- */}

      {/* HOME PAGE (Hero Banner + Live Workshop KPI Dashboard) */}
      {currentTab === "home" && (
        <HomePage onGetStarted={(tab) => navigate(tab || "customers-vehicles")} />
      )}

      {/* PAGE 1: CUSTOMERS & VEHICLES */}
      {currentTab === "customers-vehicles" && (
        <div>
          <CustomerForm />
        </div>
      )}

      {/* PAGE 2: SERVICE BOOKINGS */}
      {currentTab === "service-bookings" && (
        <div>
          <ServiceBookingForm />
        </div>
      )}

      {/* PAGE 3: SERVICE BILLS */}
      {currentTab === "servicebills" && (
        <div>
          <ServiceBillForm />
        </div>
      )}
    </div>
  );
}

export default App;
