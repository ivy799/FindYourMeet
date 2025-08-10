'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Location = {
    numLat: number;
    numLot: number;
};

type MapComponentProps = {
    locations: Location[];
};

const MapComponent = ({ locations = [] }: MapComponentProps) => { 
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !locations) return;

        let map: any;

        const initMap = async () => {
            const L = (await import("leaflet")).default;

            map = L.map("map").setView([-6.200000, 106.816666], 5);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                iconUrl: require("leaflet/dist/images/marker-icon.png"),
                shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
            });

            if (locations && Array.isArray(locations) && locations.length > 0) {
                locations.forEach(loc => {
                    if (loc && typeof loc.numLat === 'number' && typeof loc.numLot === 'number') {
                        L.marker([loc.numLat, loc.numLot]).addTo(map);
                    }
                });

                const group = L.featureGroup(
                    locations.map(loc => L.marker([loc.numLat, loc.numLot]))
                );
                map.fitBounds(group.getBounds().pad(0.1));
            }

            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        };

        initMap();

        return () => {
            if (map) map.remove();
        };
    }, [mounted, locations]);

    if (!mounted) {
        return (
            <div 
                style={{ 
                    height: "400px", 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                }}
            >
                Loading map...
            </div>
        );
    }

    return (
        <div 
            id="map" 
            style={{ 
                height: "400px", 
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden"
            }} 
        />
    );
};

export default dynamic(() => Promise.resolve(MapComponent), {
    ssr: false,
    loading: () => (
        <div 
            style={{ 
                height: "400px", 
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "8px"
            }}
        >
            Loading map...
        </div>
    )
});
