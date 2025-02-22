const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let activeDrivers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Driver Registration
  socket.on("registerDriver", () => {
    activeDrivers[socket.id] = socket;
    console.log("🚗 Driver Registered:", socket.id);
  });

  // User Requests Driver
  socket.on("requestDriver", (userData) => {
    console.log(`📌 Ride Request from ${socket.id}:`, userData);

    const driverIds = Object.keys(activeDrivers);
    if (driverIds.length > 0) {
      const randomDriverId = driverIds[Math.floor(Math.random() * driverIds.length)];
      console.log(`🚀 Sending request to Driver: ${randomDriverId}`);
      
      activeDrivers[randomDriverId].emit("incomingRequest", { 
        userId: socket.id, 
        ...userData 
      });
    } else {
      console.log("❌ No drivers available!");
      socket.emit("noDriversAvailable"); // Notify the user that no drivers are available
    }
  });

  // Driver Accepts Request
  socket.on("acceptRequest", ({ userId }) => {
    console.log(`✅ Driver ${socket.id} accepted request from User ${userId}`);
    io.to(userId).emit("requestAccepted", { driverId: socket.id });
  });

  // Handle Disconnects
  socket.on("disconnect", () => {
    delete activeDrivers[socket.id];
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
