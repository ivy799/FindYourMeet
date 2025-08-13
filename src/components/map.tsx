/* eslint-disable */
'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePOI, type Location, type POI } from "@/hooks/use-poi";
import { FourSquare } from "react-loading-indicators";

type MapComponentProps = {
    locations: Location[];
    onPOIsUpdate?: (pois: POI[]) => void;
    highlightedPOI?: string | null;
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

const MapComponent = ({ locations = [], onPOIsUpdate, highlightedPOI }: MapComponentProps) => {
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
        if (!mounted || !centroid || poisLoading) return;

        let map: any;
        let markers: any[] = [];
        let poiMarkers: Map<string, any> = new Map();

        const copyToClipboard = async (lat: number, lon: number) => {
            const coordinates = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(coordinates);
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = coordinates;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                
                // Show success notification (you can customize this)
                const notification = document.createElement('div');
                notification.textContent = 'Coordinates copied!';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `;
                document.body.appendChild(notification);
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 2000);
            } catch (error) {
                console.error('Failed to copy coordinates:', error);
            }
        };

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
                                <strong>Distance from center:</strong> ${(distance / 1000).toFixed(2)} km<br/>
                                <strong>Coordinates:</strong> ${loc.numLat.toFixed(6)}, ${loc.numLot.toFixed(6)}<br/>
                                <button onclick="navigator.clipboard ? navigator.clipboard.writeText('${loc.numLat.toFixed(6)}, ${loc.numLot.toFixed(6)}') : void(0)" 
                                        style="background:#3b82f6;color:white;border:none;padding:4px 8px;border-radius:4px;margin-top:4px;cursor:pointer;font-size:12px;">
                                    📋 Copy Coordinates
                                </button>
                            </div>
                        `);
                    
                    marker.on('click', () => {
                        copyToClipboard(loc.numLat, loc.numLot);
                    });
                    
                    markers.push(marker);
                });

                const centroidMarker = L.marker([centroid.lat, centroid.lot], {
                    icon: L.divIcon({
                        className: 'centroid-marker',
                        html: `<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:2px solid white"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    })
                }).addTo(map).bindPopup(`
                    <div>
                        🎯 <strong>Meeting Center</strong><br/>
                        <strong>Coordinates:</strong> ${centroid.lat.toFixed(6)}, ${centroid.lot.toFixed(6)}<br/>
                        <button onclick="navigator.clipboard ? navigator.clipboard.writeText('${centroid.lat.toFixed(6)}, ${centroid.lot.toFixed(6)}') : void(0)" 
                                style="background:#3b82f6;color:white;border:none;padding:4px 8px;border-radius:4px;margin-top:4px;cursor:pointer;font-size:12px;">
                            📋 Copy Coordinates
                        </button>
                    </div>
                `);
                
                centroidMarker.on('click', () => {
                    copyToClipboard(centroid.lat, centroid.lot);
                });
                
                markers.push(centroidMarker);

                if (pois.length > 0) {
                    pois.forEach((poi) => {
                        const getPoiIcon = (poi: POI, isHighlighted: boolean = false) => {
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

                            const size = isHighlighted ? 16 : 12;
                            const border = isHighlighted ? '3px solid #fbbf24' : '1px solid white';
                            const boxShadow = isHighlighted ? 'box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);' : '';

                            return L.divIcon({
                                className: 'poi-marker',
                                html: `<div style="background:${colors[amenity] || colors.other};width:${size}px;height:${size}px;border-radius:50%;border:${border};${boxShadow}"></div>`,
                                iconSize: [size, size],
                                iconAnchor: [size/2, size/2],
                            });
                        };

                        const distance = calculateDistance(centroid.lat, centroid.lot, poi.lat, poi.lon);
                        const isHighlighted = highlightedPOI === poi.id;
                        
                        const poiMarker = L.marker([poi.lat, poi.lon], { icon: getPoiIcon(poi, isHighlighted) })
                            .addTo(map)
                            .bindPopup(`
                                <div>
                                    <strong>${poi.name}</strong><br/>
                                    <strong>Type:</strong> ${poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || 'Other'}<br/>
                                    <strong>Distance:</strong> ${(distance / 1000).toFixed(2)} km from center<br/>
                                    <strong>Coordinates:</strong> ${poi.lat.toFixed(6)}, ${poi.lon.toFixed(6)}<br/>
                                    <button onclick="navigator.clipboard ? navigator.clipboard.writeText('${poi.lat.toFixed(6)}, ${poi.lon.toFixed(6)}') : void(0)" 
                                            style="background:#3b82f6;color:white;border:none;padding:4px 8px;border-radius:4px;margin-top:4px;cursor:pointer;font-size:12px;">
                                        📋 Copy Coordinates
                                    </button>
                                </div>
                            `);
                        
                        poiMarker.on('click', () => {
                            copyToClipboard(poi.lat, poi.lon);
                        });
                        
                        if (isHighlighted) {
                            poiMarker.openPopup();
                        }
                        
                        markers.push(poiMarker);
                        poiMarkers.set(poi.id, poiMarker);
                    });
                }

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
    }, [mounted, locations, pois, centroid, poisLoading, highlightedPOI]);

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

    if (poisLoading && centroid) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-background rounded-lg"
                style={{ height: "650px" }}
            >
                <FourSquare
                    size="medium"
                    color="currentColor"
                    text=""
                    textColor=""
                    style={{ color: "var(--foreground)" }}
                />
                <div className="text-sm font-medium text-gray-700 mb-1" color="currentColor" style={{ color: "var(--foreground)" }}>
                    Finding Meeting Place For You
                </div>
            </div>
        );
    }

    return (
        <div>
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
