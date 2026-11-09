var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

var customerRoutes = require("./api/Customer.route");
var vehicleRoutes = require("./api/Vehicle.route");
var serviceBookingRoutes = require("./api/Servicebooking.route");
var serviceBillRoutes = require("./api/Servicebill.route");

var app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Mount routes on /api, /api/v1, and root / */
app.use("/api/v1", customerRoutes);
app.use("/api/v1", vehicleRoutes);
app.use("/api/v1", serviceBookingRoutes);
app.use("/api/v1", serviceBillRoutes);

app.use("/api", customerRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", serviceBookingRoutes);
app.use("/api", serviceBillRoutes);

app.use(customerRoutes);
app.use(vehicleRoutes);
app.use(serviceBookingRoutes);
app.use(serviceBillRoutes);

/* MongoDB Connection */
mongoose.connect("mongodb://127.0.0.1:27017/VehicleServiceCenter");

mongoose.connection.on("connected", function () {
    console.log("MongoDB Connected");
});

mongoose.connection.on("error", function (err) {
    console.log("MongoDB Error:", err);
});

app.listen(5000, function () {
    console.log("Server running on port 5000");
});
