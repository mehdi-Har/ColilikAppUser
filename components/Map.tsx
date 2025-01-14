import React from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Map = ({ destinationLatitude, destinationLongitude }) => {
  const latitude = parseFloat(destinationLatitude) || 37.7749; // Default to San Francisco if invalid
  const longitude = parseFloat(destinationLongitude) || -122.4194; // Default to San Francisco if invalid

  return (
    <View
      style={{
        width: "100%",
        height: 300,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <MapView
        style={{ flex: 1 }}
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        userInterfaceStyle="light"
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }}
          title="Destination"
          description="This is the destination location"
          pinColor="blue"
        />
      </MapView>
    </View>
  );
};

export default Map;
