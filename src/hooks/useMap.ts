import { useState, useCallback } from 'react';
import { mapApi } from '../services/api/map';

export type MapMode = 'normal' | 'container-creation' | 'route' | 'route-creation';

interface Container {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface Route {
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
}

interface MapState {
    containers: Container[];
    routes: Route[];
    selectedRoute: Route | null;
    selectedContainers: number[]; // For route creation mode
    mode: MapMode;
    isLoading: boolean;
    error: string | null;
}

export const useMap = () => {
    const [state, setState] = useState<MapState>({
        containers: [],
        routes: [],
        selectedRoute: null,
        selectedContainers: [],
        mode: 'normal',
        isLoading: false,
        error: null,
    });

    // Fetch initial data
    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const [containers, routes] = await Promise.all([
                mapApi.getContainers(),
                mapApi.getRoutes(),
            ]);
            setState(prev => ({
                ...prev,
                containers,
                routes,
                isLoading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to fetch data',
                isLoading: false,
            }));
        }
    }, []);

    // Mode management
    const setMode = useCallback((mode: MapMode) => {
        setState(prev => ({
            ...prev,
            mode,
            selectedRoute: mode === 'route' ? prev.selectedRoute : null,
            selectedContainers: mode === 'route-creation' ? prev.selectedContainers : [],
        }));
    }, []);

    // Container creation
    const createContainer = useCallback(async (data: {
        name: string;
        address: string;
        latitude: number;
        longitude: number;
    }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const newContainer = await mapApi.createContainer(data);
            setState(prev => ({
                ...prev,
                containers: [...prev.containers, newContainer],
                isLoading: false,
            }));
            return newContainer;
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to create container',
                isLoading: false,
            }));
            throw error;
        }
    }, []);

    // Route management
    const selectRoute = useCallback((routeId: number) => {
        const route = state.routes.find(r => r.id === routeId);
        setState(prev => ({
            ...prev,
            selectedRoute: route || null,
        }));
    }, [state.routes]);

    const createRoute = useCallback(async (name: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const newRoute = await mapApi.createRoute({ name });
            setState(prev => ({
                ...prev,
                routes: [...prev.routes, newRoute],
                isLoading: false,
            }));
            return newRoute;
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to create route',
                isLoading: false,
            }));
            throw error;
        }
    }, []);

    // Node management for route creation
    const toggleContainerSelection = useCallback((containerId: number) => {
        setState(prev => {
            const isSelected = prev.selectedContainers.includes(containerId);
            return {
                ...prev,
                selectedContainers: isSelected
                    ? prev.selectedContainers.filter(id => id !== containerId)
                    : [...prev.selectedContainers, containerId],
            };
        });
    }, []);

    const saveRouteNodes = useCallback(async (routeId: number) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const nodes = state.selectedContainers.map((containerId: number, index: number) => ({
                container_id: containerId,
                order: index + 1,
            }));
            await mapApi.createNodes({ route_id: routeId, nodes });
            setState(prev => ({
                ...prev,
                isLoading: false,
                mode: 'normal',
                selectedContainers: [],
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Failed to save route nodes',
                isLoading: false,
            }));
            throw error;
        }
    }, [state.selectedContainers]);

    return {
        ...state,
        fetchData,
        setMode,
        createContainer,
        selectRoute,
        createRoute,
        toggleContainerSelection,
        saveRouteNodes,
    };
};
