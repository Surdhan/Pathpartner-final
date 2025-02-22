import React from 'react';
import {
  Box, Button, Radio, RadioGroup, Stack, Text, Image, Flex, IconButton, HStack,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import vehicleImages from '../images/images';
import './VehicleBooking.css';

const VehicleBooking = ({ setVehicleType, calculateRoute, setIsBookingPage }) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState('car');
  const [vehicleIndex, setVehicleIndex] = React.useState(0);

  const handleVehicleChange = (value) => {
    setSelectedVehicle(value);
    setVehicleType(value);
    setVehicleIndex(0); // Reset index when vehicle type changes
  };

  const handleImageChange = (direction) => {
    setVehicleIndex((prevIndex) => (
      direction === 'next'
        ? Math.min(vehicleImages[selectedVehicle]?.length - 1, prevIndex + 1)
        : Math.max(0, prevIndex - 1)
    ));
  };

  return (
    <Box className="vehicle-booking-container">
      <Text fontSize="2xl" mb={4} fontWeight="bold">Select Vehicle</Text>
      <RadioGroup onChange={handleVehicleChange} value={selectedVehicle}>
        <Stack direction="row" spacing={6} justify="center">
          {Object.keys(vehicleImages).map((vehicle) => (
            <Radio key={vehicle} value={vehicle} size="lg">
              {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>

      <Flex direction="column" align="center" mt={6}>
        <Image
          className="vehicle-image"
          src={vehicleImages[selectedVehicle]?.[vehicleIndex] || '/placeholder.png'}
          alt={`${selectedVehicle} image ${vehicleIndex + 1}`}
        />
        <HStack spacing={4} mt={4}>
          <Button
            colorScheme="blue"
            onClick={() => handleImageChange('prev')}
            disabled={vehicleIndex === 0}
          >
            Previous
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => handleImageChange('next')}
            disabled={vehicleIndex === (vehicleImages[selectedVehicle]?.length - 1)}
          >
            Next
          </Button>
        </HStack>
        <Text mt={2} fontSize="lg" fontWeight="medium">Comfortable Ride</Text>
      </Flex>

      <Button
        mt={4}
        colorScheme="teal"
        size="lg"
        onClick={() => {
          calculateRoute();
          setIsBookingPage(false);
        }}
      >
        Book {selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)}
      </Button>

      <IconButton
        className="close-button"
        aria-label="Close booking page"
        title="Close"
        icon={<FaTimes />}
        onClick={() => setIsBookingPage(false)}
        mt={4}
      />
    </Box>
  );
};

export default VehicleBooking;
