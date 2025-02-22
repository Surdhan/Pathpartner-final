import React, { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const UserCallRequest = () => {
  const [driverResponse, setDriverResponse] = useState(null);

  const requestDriver = () => {
    console.log("📢 Requesting a driver...");
    socket.emit("requestDriver", { username: "suriyamoorthy R", location: "Sellur Madurai" });
    setDriverResponse("🔄 Requesting a driver...");
  };

  useEffect(() => {
    socket.on("requestAccepted", ({ driverId }) => {
      console.log(`✅ Ride accepted by Driver ${driverId}`);
      setDriverResponse(`✅ Your ride has been accepted by Driver ${driverId}`);
    });

    socket.on("noDriversAvailable", () => {
      console.log("❌ No drivers available!");
      setDriverResponse("❌ No drivers available. Please try again.");
    });

    return () => {
      socket.off("requestAccepted");
      socket.off("noDriversAvailable");
    };
  }, []);

  return (
    <Box p={4} border="1px solid gray" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold">🧑‍ User Panel</Text>
      <Button mt={2} colorScheme="blue" onClick={requestDriver}>
        Request Driver
      </Button>
      {driverResponse && <Text mt={2} color="green.500">{driverResponse}</Text>}
    </Box>
  );
};

export default UserCallRequest;
