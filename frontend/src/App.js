/* Main Application Router (App.js) */
import React, { useState, useEffect } from "react";
import "./App.css";
/* Navigation Bar component import */
import Navbar from "./components/Navbar";
/* Page component imports from src/pages/ */
import HomePage from "./pages/HomePage";
import CustomerForm from "./pages/CustomerForm";
import ServiceBookingForm from "./pages/ServiceBookingForm";
import ServiceBillForm from "./pages/ServiceBillForm";
/* Route paths mapping */
const ROUTES = { "/": "home", "/home": "home", "/landing": "home", "/customers-vehicles": "customers-vehicles", "/customers": "customers-vehicles", "/vehicles": "customers-vehicles", "/service-bookings": "service-bookings", "/servicebookings": "service-bookings", "/servicebills": "servicebills", "/service-bills": "servicebills" };
/* Canonical path references */
const PATHS = { home: "/", "customers-vehicles": "/customers-vehicles", "service-bookings": "/servicebookings", servicebills: "/servicebills" };
/* Root App Component */
function App() {
  /* Current active navigation tab state */
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    return ROUTES[path] || ROUTES["/" + path.split("/")[1]] || "home";
  });
  /* Tab navigation handler with history push */
  const navigate = (tab) => {
    const targetPath = PATHS[tab] || "/";
    if (window.location.pathname !== targetPath) { window.history.pushState({ tab }, "", targetPath); }
    setCurrentTab(tab);
  };
  /* Sync navigation with browser back/forward buttons */
  useEffect(() => {
    const handlePopState = (event) => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      setCurrentTab((event.state && event.state.tab) || ROUTES[path] || "home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  /* Render application container and active page view */
  return (
    <div className="app-container">
      {/* Top Header & Navigation Bar */}
      <Navbar currentTab={currentTab} navigate={navigate} />
      {/* Home Page View */}
      {currentTab === "home" && <HomePage onGetStarted={(tab) => navigate(tab || "customers-vehicles")} />}
      {/* Page 1: Customers & Vehicles View */}
      {currentTab === "customers-vehicles" && <div><CustomerForm /></div>}
      {/* Page 2: Service Bookings View */}
      {currentTab === "service-bookings" && <div><ServiceBookingForm /></div>}
      {/* Page 3: Service Bills View */}
      {currentTab === "servicebills" && <div><ServiceBillForm /></div>}
    </div>
  );
}
export default App;
