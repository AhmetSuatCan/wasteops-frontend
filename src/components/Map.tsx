import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapMode } from '../hooks/useMap';
import { useEffect, useState } from 'react';

// Custom icons for different container states
const normalIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35]
});

const selectedIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    popupAnchor: [0, -35]
});

// Custom trash bin icon for containers
const trashBinIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484611.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Custom marker for temporary location
const tempMarkerIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    popupAnchor: [0, -35]
});

// Custom icon for route nodes
const routeNodeIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    popupAnchor: [0, -35]
});

// Custom arrow icon for temporary marker
const tempArrowIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/271/271239.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

interface RoutePath {
    coordinates: [number, number][];
    distance: number;
    duration: number;
}

const fetchRoutePath = async (coordinates: [number, number][]): Promise<RoutePath> => {
    try {
        // OSRM expects coordinates in [longitude, latitude] format
        const coordinatesString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
        console.log('Fetching route for coordinates:', coordinatesString);

        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code !== 'Ok') {
            console.error('OSRM API error:', data);
            throw new Error('Failed to fetch route');
        }

        // Convert coordinates back to [latitude, longitude] for Leaflet
        const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        console.log('Route coordinates:', routeCoordinates);

        return {
            coordinates: routeCoordinates,
            distance: data.routes[0].distance,
            duration: data.routes[0].duration
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        throw error;
    }
};

interface MapComponentProps {
    mode: MapMode;
    containers: Array<{
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
    }>;
    selectedContainers: number[];
    onContainerClick?: (containerId: number) => void;
    onMapClick?: (lat: number, lng: number) => void;
    pendingLocation?: { lat: number; lng: number } | null;
    selectedRoute?: {
        id: number;
        name: string;
        organization: number;
        created_by: string;
        created_at: string;
        nodes: Array<{
            id: number;
            order: number;
            container: {
                id: number;
                name: string;
                address: string;
                latitude: string;
                longitude: string;
                organization: number;
                created_at: string;
            };
        }>;
    } | null;
}

const MapEvents = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

export const MapComponent = ({
    mode,
    containers,
    selectedContainers,
    onContainerClick,
    onMapClick,
    pendingLocation,
    selectedRoute,
}: MapComponentProps) => {
    const [routePath, setRoutePath] = useState<RoutePath | null>(null);

    useEffect(() => {
        const getRoutePath = async () => {
            if (mode === 'route' && selectedRoute && selectedRoute.nodes.length > 0) {
                try {
                    const sortedNodes = selectedRoute.nodes.sort((a, b) => a.order - b.order);
                    const coordinates: [number, number][] = sortedNodes.map(node => [
                        Number(node.container.latitude),
                        Number(node.container.longitude)
                    ]);
                    const path = await fetchRoutePath(coordinates);
                    setRoutePath(path);
                } catch (error) {
                    console.error('Failed to fetch route path:', error);
                    setRoutePath(null);
                }
            } else {
                setRoutePath(null);
            }
        };

        getRoutePath();
    }, [mode, selectedRoute]);

    return (
        <div className="h-full w-full">
            <MapContainer
                center={[38.6810, 39.2264]}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onMapClick={onMapClick} />

                {/* Draw route lines if in route view mode and a route is selected */}
                {mode === 'route' && selectedRoute && selectedRoute.nodes.length > 0 && (
                    <>
                        {routePath ? (
                            <Polyline
                                positions={routePath.coordinates}
                                color="#DC2626"
                                weight={3}
                                opacity={0.7}
                            />
                        ) : (
                            <Polyline
                                positions={selectedRoute.nodes
                                    .sort((a, b) => a.order - b.order)
                                    .map(node => [
                                        Number(node.container.latitude),
                                        Number(node.container.longitude)
                                    ])}
                                color="#DC2626"
                                weight={3}
                                opacity={0.7}
                            />
                        )}
                        {selectedRoute.nodes.map((node) => (
                            <Marker
                                key={node.id}
                                position={[
                                    Number(node.container.latitude),
                                    Number(node.container.longitude)
                                ]}
                                icon={routeNodeIcon}
                            >
                                <Popup>
                                    <div className="p-3 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                                                {node.order}
                                            </div>
                                            <h3 className="font-semibold text-lg">{node.container.name}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Address:</span> {node.container.address}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Coordinates:</span><br />
                                                Lat: {Number(node.container.latitude).toFixed(6)}<br />
                                                Lng: {Number(node.container.longitude).toFixed(6)}
                                            </p>
                                            {routePath && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Route Info:</span><br />
                                                    Distance: {(routePath.distance / 1000).toFixed(1)} km<br />
                                                    Duration: {Math.round(routePath.duration / 60)} min
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </>
                )}

                {containers.map((container) => {
                    const isSelected = selectedContainers.includes(container.id);
                    let iconToUse;

                    if (mode === 'route' || mode === 'route-creation') {
                        iconToUse = isSelected ? selectedIcon : normalIcon;
                    } else {
                        iconToUse = trashBinIcon;
                    }

                    return (
                        <Marker
                            key={container.id}
                            position={[container.latitude, container.longitude]}
                            icon={iconToUse}
                            eventHandlers={{
                                click: () => onContainerClick?.(container.id)
                            }}
                        >
                            <Popup>
                                <div className="p-3 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="font-semibold text-lg">{container.name}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Address:</span> {container.address}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Coordinates:</span><br />
                                            Lat: {Number(container.latitude).toFixed(6)}<br />
                                            Lng: {Number(container.longitude).toFixed(6)}
                                        </p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {mode === 'container-creation' && pendingLocation && (
                    <Marker
                        position={[pendingLocation.lat, pendingLocation.lng]}
                        icon={tempMarkerIcon}
                    >
                        <Popup>
                            <div className="p-3 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="font-semibold text-lg">New Container Location</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Coordinates:</span><br />
                                        Lat: {Number(pendingLocation.lat).toFixed(6)}<br />
                                        Lng: {Number(pendingLocation.lng).toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};
