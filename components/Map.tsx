"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

interface MapProps {
  theme?: "light" | "dark";
  className?: string;
}

export default function Map({ theme = "light", className }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Determine style URL based on theme
  const getStyleUrl = (currentTheme: "light" | "dark") => {
    return currentTheme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleUrl(theme),
      center: [118.0186, -2.5489], // Center of Indonesia (Nusantara)
      zoom: 4.5,
      attributionControl: false,
    });

    // Add navigation controls (zoom, rotate)
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-right"
    );

    mapRef.current = map;

    // Handle resize
    const handleResize = () => {
      map.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update style when theme changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(getStyleUrl(theme));
    }
  }, [theme]);

  return (
    <div className={cn("relative w-full h-full bg-muted/20", className)}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
