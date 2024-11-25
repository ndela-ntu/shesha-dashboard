"use client";

import React from "react";
import dynamic from "next/dynamic";
import IRegion from "@/models/region";

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (coordinates: [number, number]) => void;
  allowMultipleMarkers?: boolean;
  regions: IRegion[];
  flyTo?: [number?, number?];
}

// Dynamically import Leaflet to prevent SSR issues
const DynamicMap = dynamic(
  () => import("./map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="z-0 h-96 w-full flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    ),
  }
);

const MapWrapper: React.FC<MapProps> = (props) => {
  return (
    <div className="z-0">
      <DynamicMap {...props} />
    </div>
  );
};

export default MapWrapper;
