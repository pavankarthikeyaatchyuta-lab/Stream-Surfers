# Hackathon Trivion - Vehicle Service Center Management System (M27)

This folder contains the complete, working full-stack project combining the backend and the streamlined 3-page consolidated frontend.

## Project Structure

```
Hackathon Trivion/
├── backend/
│   ├── api/
│   │   ├── Customer.route.js
│   │   ├── Vehicle.route.js
│   │   ├── Servicebooking.route.js
│   │   └── Servicebill.route.js
│   ├── models/
│   │   ├── customer.js
│   │   ├── vehicle.js
│   │   ├── servicebooking.js
│   │   └── servicebill.js
│   ├── myserver.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js                (3-page consolidated workflow router)
    │   ├── App.css               (Simple, clean layout stylesheet)
    │   ├── CustomerForm.js       (Page 1: Customer & Vehicle registration, Search, Edit, Delete)
    │   ├── ServiceBookingForm.js (Page 2: Service Bookings from existing customers, Mechanic assignment)
    │   └── ServiceBillForm.js    (Page 3: Service Bills from serviced vehicles)
    └── package.json
```

## How to Run

### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017:
```bash
mongod
```

### 2. Start Backend
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000` connected to `mongodb://127.0.0.1:27017/VehicleServiceCenter`.*

### 3. Start Frontend
```bash
cd frontend
npm start
```
*Frontend runs on `http://localhost:3000`.*
