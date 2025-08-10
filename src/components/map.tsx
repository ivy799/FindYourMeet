'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePOI, type Location, type POI } from "@/hooks/use-poi";

type MapComponentProps = {
    locations: Location[];
    onPOIsUpdate?: (pois: POI[]) => void;
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

const MapComponent = ({ locations = [], onPOIsUpdate }: MapComponentProps) => { 
    const [mounted, setMounted] = useState(false);
    const { pois, loading: poisLoading, centroid } = usePOI(locations, 2);

    useEffect(() => {
        if (onPOIsUpdate) {
            onPOIsUpdate(pois);
        }
    }, [pois, onPOIsUpdate]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !centroid) return;

        let map: any;
        let markers: any[] = [];

        const initMap = async () => {
            try {
                const mapContainer = document.getElementById("map");
                if (mapContainer) {
                    mapContainer.innerHTML = '';
                }

                const L = (await import("leaflet")).default;
                await import("leaflet/dist/leaflet.css");

                map = L.map("map").setView([centroid.lat, centroid.lot], 13);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors",
                }).addTo(map);

                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                    iconUrl: require("leaflet/dist/images/marker-icon.png"),
                    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
                });

                const radiusMeters = 2000;

                locations.forEach((loc, index) => {
                    const distance = calculateDistance(centroid.lat, centroid.lot, loc.numLat, loc.numLot);
                    const isWithinRadius = distance <= radiusMeters;
                    
                    const markerIcon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background:${isWithinRadius ? '#10b981' : '#ef4444'};width:20px;height:20px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;">${index + 1}</div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    });

                    const marker = L.marker([loc.numLat, loc.numLot], { icon: markerIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div>
                                <strong>User ${index + 1}</strong><br/>
                                ${loc.address || 'Unknown address'}<br/>
                                <strong>Distance from center:</strong> ${(distance / 1000).toFixed(2)} km
                            </div>
                        `);
                    markers.push(marker);
                });

                const centroidMarker = L.marker([centroid.lat, centroid.lot], {
                    icon: L.divIcon({
                        className: 'centroid-marker',
                        html: `<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:2px solid white"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    })
                }).addTo(map).bindPopup("🎯 Meeting Center");
                markers.push(centroidMarker);

                pois.forEach((poi) => {
                    const getPoiIcon = (poi: POI) => {
                        const amenity = poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || 'other';
                        const colors: Record<string, string> = {
                            'restaurant': '#ff6b6b',
                            'cafe': '#feca57',
                            'bar': '#ff9ff3',
                            'fast_food': '#ff7675',
                            'hotel': '#74b9ff',
                            'mall': '#a29bfe',
                            'supermarket': '#fd79a8',
                            'park': '#00b894',
                            'cinema': '#e17055',
                            'museum': '#fdcb6e',
                            'other': '#636e72'
                        };
                        
                        return L.divIcon({
                            className: 'poi-marker',
                            html: `<div style="background:${colors[amenity] || colors.other};width:12px;height:12px;border-radius:50%;border:1px solid white"></div>`,
                            iconSize: [12, 12],
                            iconAnchor: [6, 6],
                        });
                    };

                    const distance = calculateDistance(centroid.lat, centroid.lot, poi.lat, poi.lon);
                    const poiMarker = L.marker([poi.lat, poi.lon], { icon: getPoiIcon(poi) })
                        .addTo(map)
                        .bindPopup(`
                            <div>
                                <strong>${poi.name}</strong><br/>
                                <strong>Type:</strong> ${poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || 'Other'}<br/>
                                <strong>Distance:</strong> ${(distance / 1000).toFixed(2)} km from center
                            </div>
                        `);
                    markers.push(poiMarker);
                });

                const circle = L.circle([centroid.lat, centroid.lot], {
                    radius: radiusMeters,
                    color: 'blue',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                }).addTo(map);

                if (markers.length > 0) {
                    const group = new L.featureGroup([...markers, circle]);
                    map.fitBounds(group.getBounds().pad(0.1));
                }

                setTimeout(() => {
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);

            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();

        return () => {
            try {
                if (map) {
                    markers.forEach(marker => {
                        if (marker && marker.remove) {
                            marker.remove();
                        }
                    });
                    map.off();
                    map.remove();
                }
            } catch (error) {
                console.error('Error cleaning up map:', error);
            }
        };
    }, [mounted, locations, pois, centroid]);

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
        <div>
            <div className="mb-2 text-sm text-gray-600">
                Found {locations.length} user location(s) and {poisLoading ? "Loading..." : `${pois.length} POIs`} within 2km radius
            </div>
            <div 
                id="map" 
                style={{ 
                    height: "600px",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden"
                }} 
            />
            <div className="mt-2 flex gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full border-2 border-white" style={{ background: "#10b981" }}></div>
                    <span>Users within radius</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full border-2 border-white" style={{ background: "#3b82f6" }}></div>
                    <span>Meeting center</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white" style={{ background: "#ff6b6b" }}></div>
                    <span>Restaurants</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white" style={{ background: "#feca57" }}></div>
                    <span>Cafes</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white" style={{ background: "#a29bfe" }}></div>
                    <span>Shopping</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white" style={{ background: "#00b894" }}></div>
                    <span>Parks/Recreation</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white" style={{ background: "#636e72" }}></div>
                    <span>Other POIs</span>
                </div>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(MapComponent), {
    ssr: false,
    loading: () => (
        <div 
            style={{ 
                height: "500px", 
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "8px"
            }}
        >
            Loading map and POIs...
        </div>
    )
});
