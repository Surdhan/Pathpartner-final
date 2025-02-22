import React, { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const DriverCall = () => {
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    socket.emit("registerDriver");
    console.log("📢 Driver registered!");

    // Listen for ride requests
    socket.on("incomingRequest", (data) => {
      console.log("📩 Incoming ride request:", data);
      setIncomingRequest(data);
    });

    return () => {
      socket.off("incomingRequest");
    };
  }, []);

  const acceptRequest = () => {
    if (incomingRequest) {
      console.log(`✅ Accepting request from User ${incomingRequest.userId}`);
      socket.emit("acceptRequest", { userId: incomingRequest.userId });
      setIncomingRequest(null);
    }
  };

  return (
    <Box p={4} border="1px solid gray" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold">🚗 Driver Panel</Text>
      {incomingRequest ? (
        <>
          <Text mt={2}>
            📌 Ride Request from <strong>{incomingRequest.username}</strong> at{" "}
            <strong>{incomingRequest.location}</strong>
          </Text>
          <Button mt={2} colorScheme="green" onClick={acceptRequest}>
            Accept Request
          </Button>
        </>
      ) : (
        <Text mt={2}>No incoming requests</Text>
      )}
    </Box>
  );
};

export default DriverCall;
