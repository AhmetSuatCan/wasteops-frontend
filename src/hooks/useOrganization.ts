import { useState } from 'react';
import { organizationApi } from '../services/api/organization';
import { useAuthStore } from '../store/userStore';
import { authApi } from '../services/api/auth';

interface OrganizationFormData {
    name: string;
    address: string;
    organization_type: 'government' | 'private';
    num_of_facilities: number;
    num_of_cars: number;
    num_of_containers: number;
}

interface UseOrganizationReturn {
    createOrganization: (data: OrganizationFormData) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}

export const useOrganization = (): UseOrganizationReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useAuthStore();

    const createOrganization = async (data: OrganizationFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await organizationApi.createOrganization({
                name: data.name,
                address: data.address,
                organization_type: data.organization_type,
                num_of_facilities: data.num_of_facilities,
                num_of_cars: data.num_of_cars,
                num_of_containers: data.num_of_containers,
            });

            // After creating the organization, fetch the updated organization data
            if (user?.role === 'A') {
                const organizationData = await authApi.checkOwnedOrganization();
                useAuthStore.setState({ organization: organizationData });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create organization'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createOrganization,
        isLoading,
        error,
    };
};
