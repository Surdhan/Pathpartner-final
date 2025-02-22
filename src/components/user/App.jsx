import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  IconButton,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import UserCallRequest from "../user/UserCallRequest"; 
import DriverCall from "../Driver/DriverCall"; 
import VehicleBooking from "./VehicleBooking";
import "./App.css";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [isDriver, setIsDriver] = useState(false);
  const [isBookingPage, setIsBookingPage] = useState(false);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState("car");
  const [waypoints, setWaypoints] = useState([]);
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  const originRef = useRef();
  const destinationRef = useRef();
  const originAutocompleteRef = useRef();
  const destinationAutocompleteRef = useRef();
  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => console.error("Geolocation permission denied or error occurred.")
      );
    }
  }, []);

  const onPlaceChanged = (type) => {
    const place = type === "origin" ? originAutocompleteRef.current.getPlace() : destinationAutocompleteRef.current.getPlace();
    if (place.geometry) {
      type === "origin" ? setOriginPlace(place) : setDestinationPlace(place);
    }
  };

  async function calculateRoute() {
    if (!isLoaded || !window.google || !originPlace || !destinationPlace) return;
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originPlace.geometry.location,
      destination: destinationPlace.geometry.location,
      waypoints: waypoints.map((point) => ({ location: point, stopover: true })),
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    });
    setDirectionsResponses([results]);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    mapRef.current?.fitBounds(new window.google.maps.LatLngBounds(...results.routes[0].legs.map((leg) => [leg.start_location, leg.end_location]).flat()));
  }

  function clearRoute() {
    setDirectionsResponses([]);
    setDistance("");
    setDuration("");
    setOriginPlace(null);
    setDestinationPlace(null);
    originRef.current.value = "";
    destinationRef.current.value = "";
    setWaypoints([]);
    mapRef.current?.panTo(userLocation);
    mapRef.current?.setZoom(15);
  }

  if (!isLoaded || !userLocation) return <div>Loading...</div>;

  return (
    <Flex direction="column" alignItems="center" h="100vh" w="100vw" bg="gray.50" p={4} gap={4}>
      <ButtonGroup spacing={4}>
        <Button onClick={() => setIsDriver(false)}>User</Button>
        <Button onClick={() => setIsDriver(true)}>Driver</Button>
      </ButtonGroup>
      {isDriver ? <DriverCall isDriver={isDriver} /> : <UserCallRequest />}

      <Flex className="main-container">
        <Box className="map-container">
          <GoogleMap ref={mapRef} center={userLocation} zoom={15} mapContainerStyle={{ width: "100%", height: "100%" }}>
            <Marker position={userLocation} />
            {originPlace && <Marker position={originPlace.geometry.location} />}
            {destinationPlace && <Marker position={destinationPlace.geometry.location} />}
            {directionsResponses.map((response, index) => (
              <DirectionsRenderer key={index} directions={response} />
            ))}
          </GoogleMap>
        </Box>

        <Box className="controls-container">
          <ButtonGroup mb={4} width="100%">
            <Button onClick={() => setIsBookingPage(false)} colorScheme="teal" flex="1">Distance & Duration</Button>
            <Button onClick={() => setIsBookingPage(true)} colorScheme="purple" flex="1">Vehicle Booking</Button>
          </ButtonGroup>

          <div className="content-container">
            {!isBookingPage ? (
              <Box className="distance-calculation">
                <HStack spacing={4}>
                  <Autocomplete onLoad={(auto) => (originAutocompleteRef.current = auto)} onPlaceChanged={() => onPlaceChanged("origin")}>
                    <Input type="text" placeholder="Origin" ref={originRef} />
                  </Autocomplete>
                  <Autocomplete onLoad={(auto) => (destinationAutocompleteRef.current = auto)} onPlaceChanged={() => onPlaceChanged("destination")}>
                    <Input type="text" placeholder="Destination" ref={destinationRef} />
                  </Autocomplete>
                </HStack>
                <ButtonGroup mt={4} width="100%">
                  <Button colorScheme="pink" onClick={calculateRoute} flex="1">Calculate Route</Button>
                  <IconButton aria-label="clear route" icon={<FaTimes />} onClick={clearRoute} flex="1" />
                </ButtonGroup>
                <HStack spacing={4} mt={4}>
                  <Text>Distance: {distance}</Text>
                  <Text>Duration: {duration}</Text>
                </HStack>
              </Box>
            ) : (
              <VehicleBooking setVehicleType={setVehicleType} calculateRoute={calculateRoute} />
            )}
          </div>
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
