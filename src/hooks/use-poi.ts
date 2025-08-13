import { useState, useEffect } from 'react';

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
    distance?: number; 
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
        console.log('Overpass API response:', data);
        
        const pois: POI[] = data.elements.map((element: { id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }) => {
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

            // Filter out POIs without names or with generic names
            const name = element.tags?.name;
            if (!name || name.toLowerCase() === 'unknown' || name.trim() === '') {
                return null;
            }

            return {
                id: `${element.type}-${element.id}`,
                lat,
                lon,
                name: name,
                type: element.type,
                amenity: element.tags?.amenity,
                tags: element.tags || {}
            };
        }).filter((poi: POI | null): poi is POI => poi !== null);

        console.log('Processed POIs:', pois.length);
        return pois;
    } catch (error) {
        console.error('Error fetching POIs:', error);
        return [];
    }
}

export function usePOI(locations: Location[], radiusKm: number = 2) {
    const [pois, setPois] = useState<POI[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [centroid, setCentroid] = useState<{ lat: number; lot: number } | null>(null);

    useEffect(() => {
        const fetchPOIs = async () => {
            console.log('Fetching POIs for locations:', locations);
            
            if (!locations || locations.length === 0) {
                setPois([]);
                setCentroid(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const calculatedCentroid = calculateCentroid(locations);
                if (!calculatedCentroid) {
                    throw new Error('Could not calculate centroid');
                }

                console.log('Calculated centroid:', calculatedCentroid);
                setCentroid(calculatedCentroid);
                
                const radiusMeters = radiusKm * 1000;
                const fetchedPois = await fetchPOIsInRadius(calculatedCentroid, radiusMeters);
                
                const poisWithDistance = fetchedPois.map(poi => ({
                    ...poi,
                    distance: calculateDistance(calculatedCentroid.lat, calculatedCentroid.lot, poi.lat, poi.lon)
                }));

                poisWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

                console.log('Final POIs with distance:', poisWithDistance.length);
                setPois(poisWithDistance);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch POIs');
            } finally {
                setLoading(false);
            }
        };

        fetchPOIs();
    }, [locations, radiusKm]);

    return { pois, loading, error, centroid };
}

export type { POI, Location };