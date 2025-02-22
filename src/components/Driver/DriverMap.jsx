import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const DriverMap = ({ driverLocation, rideRequest }) => {
  return (
    <GoogleMap
      center={driverLocation}
      zoom={15}
      mapContainerStyle={{ width: '100%', height: '300px' }}
    >
      <Marker position={driverLocation} label="You" />
      {rideRequest && (
        <>
          <Marker position={rideRequest.origin} label="Passenger" />
          <Marker position={rideRequest.destination} label="Destination" />
        </>
      )}
    </GoogleMap>
  );
};

export default DriverMap;
