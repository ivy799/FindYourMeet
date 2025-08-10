'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Location = {
    numLat: number;
    numLot: number;
    address?: string;
};

type POI = {
    id: string;
    lat: number;
    lon: number;
    name?: string;
    type: string;
    amenity?: string;
    tags: Record<string, string>;
};

type MapComponentProps = {
    locations: Location[];
};

function calculateCentroid(locations: Location[]) {
    if (!locations.length) return null;
    let sumLat = 0;
    let sumLot = 0;
    locations.forEach(loc => {
        sumLat += loc.numLat;
        sumLot += loc.numLot;
    });
    return {
        lat: sumLat / locations.length,
        lot: sumLot / locations.length,
    };
}

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

async function fetchPOIsInRadius(centroid: { lat: number; lot: number }, radiusMeters: number): Promise<POI[]> {
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"^(restaurant|cafe|bar|fast_food|food_court|pub|biergarten)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          node["shop"~"^(mall|supermarket|convenience|department_store)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          node["leisure"~"^(park|garden|sports_centre|fitness_centre|cinema)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          node["tourism"~"^(hotel|attraction|museum|gallery)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          node["office"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          way["amenity"~"^(restaurant|cafe|bar|fast_food|food_court|pub|biergarten)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          way["shop"~"^(mall|supermarket|convenience|department_store)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          way["leisure"~"^(park|garden|sports_centre|fitness_centre|cinema)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          way["tourism"~"^(hotel|attraction|museum|gallery)$"](around:${radiusMeters},${centroid.lat},${centroid.lot});
          way["office"](around:${radiusMeters},${centroid.lat},${centroid.lot});
        );
        out center geom;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(query)}`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const pois: POI[] = data.elements.map((element: any) => {
            let lat, lon;
            
            if (element.type === 'node') {
                lat = element.lat;
                lon = element.lon;
            } else if (element.type === 'way' && element.center) {
                lat = element.center.lat;
                lon = element.center.lon;
            } else {
                return null;
            }

            return {
                id: `${element.type}-${element.id}`,
                lat,
                lon,
                name: element.tags?.name || 'Unknown',
                type: element.type,
                amenity: element.tags?.amenity,
                tags: element.tags || {}
            };
        }).filter((poi: POI | null): poi is POI => poi !== null);

        return pois;
    } catch (error) {
        console.error('Error fetching POIs:', error);
        return [];
    }
}

const MapComponent = ({ locations = [] }: MapComponentProps) => { 
    const [mounted, setMounted] = useState(false);
    const [pois, setPois] = useState<POI[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let map: any;

        const initMap = async () => {
            const L = (await import("leaflet")).default;
            await import("leaflet/dist/leaflet.css");

            map = L.map("map").setView([-6.2088, 106.8456], 11);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                iconUrl: require("leaflet/dist/images/marker-icon.png"),
                shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
            });

            const markers: any[] = [];
            if (locations && Array.isArray(locations) && locations.length > 0) {
                const centroid = calculateCentroid(locations);
                console.log("🎯 Centroid calculated:", centroid);

                if (centroid) {
                    const radiusKm = 2; 
                    const radiusMeters = radiusKm * 1000;
                    
                    console.log(`🔍 Fetching POIs within ${radiusKm}km radius...`);
                    const fetchedPois = await fetchPOIsInRadius(centroid, radiusMeters);
                    setPois(fetchedPois);
                    
                    console.log("🏢 POIs found in radius:");
                    console.log(`Total POIs: ${fetchedPois.length}`);
                    
                    const poisByCategory = fetchedPois.reduce((acc, poi) => {
                        const category = poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || poi.tags.office || 'other';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(poi);
                        return acc;
                    }, {} as Record<string, POI[]>);
                    
                    console.log("📊 POIs by category:", poisByCategory);
                    
                    fetchedPois.forEach((poi, index) => {
                        const distance = calculateDistance(centroid.lat, centroid.lot, poi.lat, poi.lon);
                        console.log(`POI ${index + 1}: ${poi.name}`, {
                            type: poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || 'other',
                            coordinates: [poi.lat, poi.lon],
                            distanceFromCenter: `${(distance / 1000).toFixed(2)} km`,
                            tags: poi.tags
                        });
                    });

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

                    L.marker([centroid.lat, centroid.lot], {
                        icon: L.divIcon({
                            className: 'centroid-marker',
                            html: `<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:2px solid white"></div>`,
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                        })
                    }).addTo(map).bindPopup("🎯 Meeting Center");

                    fetchedPois.forEach((poi, index) => {
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
                        L.marker([poi.lat, poi.lon], { icon: getPoiIcon(poi) })
                            .addTo(map)
                            .bindPopup(`
                                <div>
                                    <strong>${poi.name}</strong><br/>
                                    <strong>Type:</strong> ${poi.tags.amenity || poi.tags.shop || poi.tags.leisure || poi.tags.tourism || 'Other'}<br/>
                                    <strong>Distance:</strong> ${(distance / 1000).toFixed(2)} km from center
                                </div>
                            `);
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
                }
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
        <div>
            <div className="mb-2 text-sm text-gray-600">
                Found {locations.length} user location(s) and {pois.length} POIs within 2km radius
                <span className="ml-2 text-blue-600">
                    (Check console for detailed POI analysis)
                </span>
            </div>
            <div 
                id="map" 
                style={{ 
                    height: "500px",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden"
                }} 
            />
            <div className="mt-2 flex gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Users within radius</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Meeting center</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Restaurants</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Cafes</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Shopping</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Parks/Recreation</span>
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
