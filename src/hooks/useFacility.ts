import { useState, useCallback } from 'react';
import { organizationApi } from '../services/api/organization';

export interface Facility {
    id: string;
    name: string;
    address: string;
    facility_type: 'recycling' | 'treatment';
    capacity: number;
    contact_info?: string;
    operating_hours?: string;
}

export interface CreateFacilityData {
    name: string;
    address: string;
    facility_type: 'recycling' | 'treatment';
    capacity: number;
    contact_info?: string;
    operating_hours?: string;
}

export const useFacility = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFacilities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await organizationApi.getFacilities();
            setFacilities(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch facilities');
        } finally {
            setLoading(false);
        }
    }, []);

    const createFacility = useCallback(async (data: CreateFacilityData) => {
        try {
            setLoading(true);
            setError(null);
            const newFacility = await organizationApi.createFacility(data);
            setFacilities(prev => [...prev, newFacility]);
            return newFacility;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create facility');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFacility = useCallback(async (facilityId: string, data: CreateFacilityData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedFacility = await organizationApi.updateFacility(facilityId, data);
            setFacilities(prev => prev.map(facility =>
                facility.id === facilityId ? updatedFacility : facility
            ));
            return updatedFacility;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update facility');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteFacility = useCallback(async (facilityId: string) => {
        try {
            setLoading(true);
            setError(null);
            await organizationApi.deleteFacility(facilityId);
            setFacilities(prev => {
                const updatedFacilities = prev.filter(facility => facility.id !== facilityId);
                return [...updatedFacilities];
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete facility');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        facilities,
        loading,
        error,
        fetchFacilities,
        createFacility,
        updateFacility,
        deleteFacility,
    };
};
