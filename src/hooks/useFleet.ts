import { useState } from 'react';
import { organizationApi } from '../services/api/organization';

export interface Truck {
    id: number;
    license_plate: string;
    car_type: 'truck' | 'van';
    capacity: number;
    status: string;
    location: string;
    organization: number;
}

export interface CreateTruckData {
    license_plate: string;
    car_type: 'truck' | 'van';
    capacity: number;
    status: string;
    location: string;
}

export const useFleet = () => {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrucks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await organizationApi.getTrucks();
            setTrucks(data);
        } catch (err) {
            setError('Failed to fetch trucks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createTruck = async (truckData: CreateTruckData) => {
        try {
            setLoading(true);
            setError(null);
            const newTruck = await organizationApi.createTruck(truckData);
            setTrucks(prev => [...prev, newTruck]);
            return newTruck;
        } catch (err) {
            setError('Failed to create truck');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTruck = async (truckId: string, truckData: CreateTruckData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedTruck = await organizationApi.updateTruck(truckId, truckData);
            setTrucks(prev => prev.map(truck =>
                truck.id === parseInt(truckId) ? { ...truck, ...updatedTruck } : truck
            ));
            return updatedTruck;
        } catch (err) {
            setError('Failed to update truck');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTruck = async (truckId: string) => {
        try {
            setLoading(true);
            setError(null);
            await organizationApi.deleteTruck(truckId);
            setTrucks(prev => prev.filter(truck => truck.id !== parseInt(truckId)));
        } catch (err) {
            setError('Failed to delete truck');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        trucks,
        loading,
        error,
        fetchTrucks,
        createTruck,
        updateTruck,
        deleteTruck,
    };
};
