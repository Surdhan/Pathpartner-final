import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, HStack, useToast, IconButton } from '@chakra-ui/react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import DriverMap from './DriverMap';  // Component for displaying map with driver location
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const DriverDashboard = () => {
  const [rideRequest, setRideRequest] = useState(null); // Store the incoming ride request details
  const [isRideAccepted, setIsRideAccepted] = useState(false);
  const [isRideRejected, setIsRideRejected] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const toast = useToast();
  
  const mapRef = useRef();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ lat: latitude, lng: longitude });
        },
        () => {
          console.error('Geolocation error');
        }
      );
    }
  }, []);

  const handleAcceptRide = () => {
    setIsRideAccepted(true);
    setIsRideRejected(false);
    toast({
      title: 'Ride Accepted',
      description: 'You have accepted the ride. Navigating...',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Assume that you calculate the route to the passenger's destination here
    if (rideRequest) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: rideRequest.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirectionsResponse(result);
          }
        }
      );
    }
  };

  const handleRejectRide = () => {
    setIsRideRejected(true);
    setIsRideAccepted(false);
    toast({
      title: 'Ride Rejected',
      description: 'You have rejected the ride.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    setRideRequest(null); // Clear the current ride request
  };

  // Sample incoming ride request (You could integrate this with your backend to fetch real requests)
  useEffect(() => {
    const incomingRequest = {
      origin: { lat: 40.7128, lng: -74.0060 }, // Example origin (e.g., user location)
      destination: { lat: 40.73061, lng: -73.935242 }, // Example destination
      riderName: 'John Doe',
    };
    setRideRequest(incomingRequest);
  }, []);

  if (!isLoaded || !driverLocation) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={4} minHeight="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Driver Dashboard</Text>

      <DriverMap driverLocation={driverLocation} rideRequest={rideRequest} />

      {rideRequest && !isRideAccepted && !isRideRejected && (
        <Box mt={4}>
          <Text>Ride Request from {rideRequest.riderName}</Text>
          <HStack spacing={4} mt={4}>
            <Button colorScheme="green" leftIcon={<FaCheckCircle />} onClick={handleAcceptRide}>Accept Ride</Button>
            <Button colorScheme="red" leftIcon={<FaTimes />} onClick={handleRejectRide}>Reject Ride</Button>
          </HStack>
        </Box>
      )}

      {isRideAccepted && (
        <Box mt={4}>
          <Text>Ride Accepted. Heading to destination...</Text>
          <GoogleMap
            center={driverLocation}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '300px' }}
            ref={mapRef}
          >
            <Marker position={driverLocation} />
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
        </Box>
      )}

      {isRideRejected && (
        <Box mt={4}>
          <Text>Ride Rejected. No further action.</Text>
        </Box>
      )}
    </Box>
  );
};

export default DriverDashboard;
