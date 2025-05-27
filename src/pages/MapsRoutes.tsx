import { useEffect, useState } from 'react';
import { MapComponent } from '../components/Map';
import { useMap, MapMode } from '../hooks/useMap';

const Map = () => {
    const {
        containers,
        routes,
        selectedRoute,
        selectedContainers,
        mode,
        isLoading,
        error,
        fetchData,
        setMode,
        createContainer,
        selectRoute,
        createRoute,
        toggleContainerSelection,
        saveRouteNodes,
    } = useMap();

    const [newContainerName, setNewContainerName] = useState('');
    const [newContainerAddress, setNewContainerAddress] = useState('');
    const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMapClick = (lat: number, lng: number) => {
        if (mode === 'container-creation') {
            setPendingLocation({
                lat: Number(lat.toFixed(6)),
                lng: Number(lng.toFixed(6))
            });
        }
    };

    const handleCreateContainer = async () => {
        if (pendingLocation && newContainerName && newContainerAddress) {
            try {
                await createContainer({
                    name: newContainerName,
                    address: newContainerAddress,
                    latitude: Number(pendingLocation.lat.toFixed(6)),
                    longitude: Number(pendingLocation.lng.toFixed(6))
                });
                // Reset form
                setNewContainerName('');
                setNewContainerAddress('');
                setPendingLocation(null);
            } catch (error) {
                console.error('Failed to create container:', error);
            }
        }
    };

    const handleContainerClick = (containerId: number) => {
        if (mode === 'route-creation') {
            toggleContainerSelection(containerId);
        }
    };

    const filteredContainers = mode === 'route' && selectedRoute
        ? containers.filter(container =>
            selectedRoute.nodes.some(node => node.container_id === container.id)
        )
        : containers;

    return (
        <div className="p-6 h-[calc(100vh-4rem)]">
            <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                {/* Mode Selection */}
                <div className="mb-4">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setMode('normal')}
                            className={`px-6 py-3 text-base font-medium rounded-l-md ${mode === 'normal'
                                ? 'bg-[#169976] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Normal
                        </button>
                        <button
                            onClick={() => setMode('container-creation')}
                            className={`px-6 py-3 text-base font-medium ${mode === 'container-creation'
                                ? 'bg-[#169976] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Create Container
                        </button>
                        <button
                            onClick={() => setMode('route')}
                            className={`px-6 py-3 text-base font-medium ${mode === 'route'
                                ? 'bg-[#169976] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            View Route
                        </button>
                        <button
                            onClick={() => setMode('route-creation')}
                            className={`px-6 py-3 text-base font-medium rounded-r-md ${mode === 'route-creation'
                                ? 'bg-[#169976] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Create Route
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4 h-[calc(100%-3rem)]">
                    {/* Side Panel */}
                    <div className="col-span-3 h-full">
                        <div className="bg-gray-50 rounded-lg p-4 h-full overflow-y-auto">
                            <h2 className="text-lg font-semibold mb-4">
                                {mode === 'normal' && 'Containers'}
                                {mode === 'container-creation' && 'Create Container'}
                                {mode === 'route' && 'Routes'}
                                {mode === 'route-creation' && 'Create Route'}
                            </h2>

                            {mode === 'normal' && (
                                <div className="space-y-4">
                                    {containers.map(container => (
                                        <div
                                            key={container.id}
                                            className="bg-white p-4 rounded-lg shadow-sm"
                                        >
                                            <h3 className="font-medium">{container.name}</h3>
                                            <p className="text-sm text-gray-600">{container.address}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {mode === 'container-creation' && (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h3 className="font-medium mb-4">New Container Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={newContainerName}
                                                    onChange={(e) => setNewContainerName(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                                <input
                                                    type="text"
                                                    value={newContainerAddress}
                                                    onChange={(e) => setNewContainerAddress(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            {pendingLocation && (
                                                <div className="text-sm text-gray-600">
                                                    Selected location:<br />
                                                    Lat: {Number(pendingLocation.lat).toFixed(6)}<br />
                                                    Lng: {Number(pendingLocation.lng).toFixed(6)}
                                                </div>
                                            )}
                                            <button
                                                onClick={handleCreateContainer}
                                                disabled={!pendingLocation || !newContainerName || !newContainerAddress}
                                                className="w-full px-6 py-3 text-base font-medium bg-[#169976] text-white rounded-md hover:bg-[#138066] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                Create Container
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Click on the map to select a location for the new container.
                                    </div>
                                </div>
                            )}

                            {mode === 'route' && (
                                <div className="space-y-4">
                                    {routes.map(route => (
                                        <div
                                            key={route.id}
                                            onClick={() => selectRoute(route.id)}
                                            className={`p-4 rounded-lg cursor-pointer ${selectedRoute?.id === route.id
                                                ? 'bg-blue-100'
                                                : 'bg-white'
                                                }`}
                                        >
                                            <h3 className="font-medium">{route.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {route.nodes.length} containers
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {mode === 'route-creation' && (
                                <div className="space-y-4">
                                    <button
                                        onClick={async () => {
                                            const routeName = prompt('Enter route name:');
                                            if (routeName) {
                                                try {
                                                    // First create the route
                                                    const route = await createRoute(routeName);
                                                    // Then create the nodes for the route
                                                    await saveRouteNodes(route.id);
                                                    // Refresh the data to get the updated route with nodes
                                                    await fetchData();
                                                } catch (error) {
                                                    console.error('Failed to create route:', error);
                                                    alert('Failed to create route. Please try again.');
                                                }
                                            }
                                        }}
                                        disabled={selectedContainers.length === 0}
                                        className="w-full px-6 py-3 text-base font-medium bg-[#169976] text-white rounded-md hover:bg-[#138066] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Save Route
                                    </button>
                                    <div className="text-sm text-gray-600 mb-4">
                                        {selectedContainers.length === 0
                                            ? 'Select containers to create a route'
                                            : `Selected ${selectedContainers.length} containers`}
                                    </div>
                                    <div className="space-y-2">
                                        {containers.map(container => (
                                            <div
                                                key={container.id}
                                                onClick={() => toggleContainerSelection(container.id)}
                                                className={`p-4 rounded-lg cursor-pointer ${selectedContainers.includes(container.id)
                                                    ? 'bg-green-100'
                                                    : 'bg-white'
                                                    }`}
                                            >
                                                <h3 className="font-medium">{container.name}</h3>
                                                <p className="text-sm text-gray-600">{container.address}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="col-span-9 h-full">
                        <div className="h-full w-full rounded-lg overflow-hidden">
                            <MapComponent
                                mode={mode}
                                containers={filteredContainers}
                                selectedContainers={selectedContainers}
                                onContainerClick={handleContainerClick}
                                onMapClick={handleMapClick}
                                pendingLocation={pendingLocation}
                                selectedRoute={selectedRoute}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
